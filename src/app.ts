import { loadAppData, saveAppData } from "./storage";
import type {
  AppData,
  Appointment,
  AppointmentStatus,
  Patient,
  Visit,
  VisitDraft,
  VitalSigns,
} from "./types";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Agendado",
  waiting: "Aguardando",
  "in-progress": "Em atendimento",
  attended: "Atendido",
};

const EMPTY_DRAFT: VisitDraft = {
  notes: "",
  systolicPressure: "",
  diastolicPressure: "",
  heartRate: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  heightCm: "",
};

interface AppState {
  data: AppData;
  selectedDate: string;
  selectedAppointmentId: string | null;
  selectedPatientId: string | null;
  draft: VisitDraft;
  message: string;
  messageKind: "error" | "success" | "";
}

function localDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function showOptionalList(items: string[] | null): string {
  if (items === null) {
    return '<p class="muted">Não informado</p>';
  }

  if (items.length === 0) {
    return '<p class="muted">Nenhum registro cadastrado</p>';
  }

  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function findPatient(data: AppData, patientId: string): Patient | undefined {
  return data.patients.find((patient) => patient.id === patientId);
}

function getPatientVisits(data: AppData, patientId: string): Visit[] {
  return data.visits
    .filter((visit) => visit.patientId === patientId)
    .sort(
      (first, second) =>
        Date.parse(second.recordedAt) - Date.parse(first.recordedAt),
    );
}

function renderVitalSummary(visit: Visit): string {
  const signs = visit.vitalSigns;
  const pressure =
    signs.systolicPressure !== null && signs.diastolicPressure !== null
      ? `${signs.systolicPressure}/${signs.diastolicPressure} mmHg`
      : "Não informado";

  return `
    <dl class="visit-vitals">
      <div><dt>Pressão arterial</dt><dd>${pressure}</dd></div>
      <div><dt>Frequência cardíaca</dt><dd>${signs.heartRate === null ? "Não informado" : `${signs.heartRate} bpm`}</dd></div>
      <div><dt>Temperatura</dt><dd>${signs.temperature === null ? "Não informado" : `${signs.temperature} °C`}</dd></div>
      <div><dt>Frequência respiratória</dt><dd>${signs.respiratoryRate === null ? "Não informado" : `${signs.respiratoryRate} irpm`}</dd></div>
      <div><dt>Saturação</dt><dd>${signs.oxygenSaturation === null ? "Não informado" : `${signs.oxygenSaturation}%`}</dd></div>
      <div><dt>Altura</dt><dd>${visit.heightCm === null ? "Não informado" : `${visit.heightCm} cm`}</dd></div>
    </dl>
  `;
}

function renderVisitHistory(visits: Visit[]): string {
  if (visits.length === 0) {
    return '<p class="muted">Histórico clínico não informado.</p>';
  }

  return `<ol class="visit-list">${visits
    .map(
      (visit) => `
        <li class="visit-card">
          <p class="visit-date">${escapeHtml(formatDateTime(visit.recordedAt))}</p>
          <p>${visit.notes ? escapeHtml(visit.notes) : "Observações não informadas."}</p>
          ${renderVitalSummary(visit)}
        </li>
      `,
    )
    .join("")}</ol>`;
}

function renderAppointment(
  appointment: Appointment,
  patient: Patient | undefined,
  isSelected: boolean,
): string {
  const patientName = patient
    ? escapeHtml(patient.name)
    : "Paciente indisponível";

  return `
    <li class="appointment-item${isSelected ? " is-selected" : ""}">
      <span class="appointment-time">${escapeHtml(formatTime(appointment.startsAt))}</span>
      <div class="appointment-info">
        <strong>${patientName}</strong>
      </div>
      <span class="status-pill status-${appointment.status}">${STATUS_LABELS[appointment.status]}</span>
      <button
        class="button button-quiet"
        type="button"
        data-action="open-patient"
        data-appointment-id="${escapeHtml(appointment.id)}"
        data-patient-id="${escapeHtml(appointment.patientId)}"
        aria-label="Abrir perfil de ${patientName}"
      >Abrir</button>
    </li>
  `;
}

function renderAgenda(state: AppState): string {
  const dayAppointments = state.data.appointments
    .filter(
      (appointment) =>
        localDateValue(new Date(appointment.startsAt)) === state.selectedDate,
    )
    .sort(
      (first, second) =>
        Date.parse(first.startsAt) - Date.parse(second.startsAt),
    );

  const statusSummary = (
    ["waiting", "in-progress", "scheduled", "attended"] as AppointmentStatus[]
  )
    .map((status) => {
      const count = dayAppointments.filter(
        (appointment) => appointment.status === status,
      ).length;
      return `<span class="status-summary-item"><span class="status-pill status-${status}">${STATUS_LABELS[status]}</span><strong>${count}</strong></span>`;
    })
    .join("");

  return `
    <section class="panel agenda-panel" aria-labelledby="agenda-heading">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Organização do dia</p>
          <h2 id="agenda-heading">Agenda e fila</h2>
        </div>
        <label class="date-control">
          <span>Data</span>
          <input type="date" name="selectedDate" value="${escapeHtml(state.selectedDate)}" />
        </label>
      </div>
      <div class="agenda-status-summary" aria-label="Resumo por situação">${statusSummary}</div>
      ${
        dayAppointments.length === 0
          ? '<div class="empty-state"><span class="empty-icon" aria-hidden="true">—</span><strong>Nenhum agendamento nesta data</strong><p>Escolha outra data para consultar a agenda.</p></div>'
          : `<ul class="appointment-list">${dayAppointments
              .map((appointment) =>
                renderAppointment(
                  appointment,
                  findPatient(state.data, appointment.patientId),
                  appointment.id === state.selectedAppointmentId,
                ),
              )
              .join("")}</ul>`
      }
    </section>
  `;
}

function renderVitalsForm(draft: VisitDraft): string {
  const value = (field: keyof VisitDraft) =>
    `value="${escapeHtml(draft[field])}"`;

  return `
    <form id="visit-form" class="visit-form" novalidate>
      <label class="field field-wide">
        <span>Observações clínicas</span>
        <textarea name="notes" rows="3" placeholder="Registre observações relevantes">${escapeHtml(draft.notes)}</textarea>
      </label>
      <fieldset class="measurement-grid">
        <legend>Sinais vitais</legend>
        <label class="field">
          <span>Pressão sistólica <small>mmHg</small></span>
          <input name="systolicPressure" type="number" min="0.1" step="any" inputmode="decimal" ${value("systolicPressure")} />
        </label>
        <label class="field">
          <span>Pressão diastólica <small>mmHg</small></span>
          <input name="diastolicPressure" type="number" min="0.1" step="any" inputmode="decimal" ${value("diastolicPressure")} />
        </label>
        <label class="field">
          <span>Frequência cardíaca <small>bpm</small></span>
          <input name="heartRate" type="number" min="0.1" step="any" inputmode="decimal" ${value("heartRate")} />
        </label>
        <label class="field">
          <span>Temperatura <small>°C</small></span>
          <input name="temperature" type="number" min="0.1" step="any" inputmode="decimal" ${value("temperature")} />
        </label>
        <label class="field">
          <span>Frequência respiratória <small>irpm</small></span>
          <input name="respiratoryRate" type="number" min="0.1" step="any" inputmode="decimal" ${value("respiratoryRate")} />
        </label>
        <label class="field">
          <span>Saturação de oxigênio <small>%</small></span>
          <input name="oxygenSaturation" type="number" min="0.1" max="100" step="any" inputmode="decimal" ${value("oxygenSaturation")} />
        </label>
        <label class="field">
          <span>Altura <small>cm</small></span>
          <input name="heightCm" type="number" min="0.1" step="any" inputmode="decimal" ${value("heightCm")} />
        </label>
      </fieldset>
      <p class="form-hint">Todos os campos são opcionais. Valores em branco serão salvos como não informados.</p>
      <div class="form-actions">
        <button class="button button-primary" type="submit">Salvar e concluir atendimento</button>
      </div>
    </form>
  `;
}

function renderPatientPanel(state: AppState): string {
  if (state.selectedPatientId === null) {
    return `
      <section class="panel patient-panel patient-placeholder">
        <p class="eyebrow">Atendimento selecionado</p>
        <div class="empty-state">
          <span class="empty-icon" aria-hidden="true">+</span>
          <strong>Selecione um paciente</strong>
          <p>Abra um paciente na agenda para consultar o perfil e iniciar o atendimento.</p>
        </div>
      </section>
    `;
  }

  const patient = findPatient(state.data, state.selectedPatientId);
  if (!patient) {
    return `
      <section class="panel patient-panel" aria-live="polite">
        <div class="notice notice-error">Não foi possível localizar este paciente.</div>
      </section>
    `;
  }

  const appointment = state.selectedAppointmentId
    ? state.data.appointments.find(
        (item) => item.id === state.selectedAppointmentId,
      )
    : undefined;
  const visits = getPatientVisits(state.data, patient.id);
  const activeVisit = appointment?.status === "in-progress";
  const completedVisit = appointment?.status === "attended";

  let actionContent = "";
  if (appointment?.status === "scheduled") {
    actionContent = `
      <div class="inline-action">
        <span>Confirme a chegada para liberar o início do atendimento.</span>
        <button class="button button-secondary" type="button" data-action="mark-arrived" data-appointment-id="${escapeHtml(appointment.id)}">Confirmar chegada</button>
      </div>
    `;
  } else if (appointment?.status === "waiting") {
    actionContent = `
      <div class="inline-action">
        <span>Paciente aguardando atendimento.</span>
        <button class="button button-primary" type="button" data-action="start-visit" data-appointment-id="${escapeHtml(appointment.id)}">Iniciar atendimento</button>
      </div>
    `;
  } else if (activeVisit) {
    actionContent = `
      <section class="consultation-section" aria-labelledby="consultation-heading">
        <div class="section-heading">
          <div><p class="eyebrow">Registro atual</p><h3 id="consultation-heading">Atendimento em andamento</h3></div>
        </div>
        ${state.message ? `<div class="notice notice-${state.messageKind}" role="${state.messageKind === "error" ? "alert" : "status"}">${escapeHtml(state.message)}</div>` : ""}
        ${renderVitalsForm(state.draft)}
      </section>
    `;
  } else if (completedVisit) {
    actionContent = '<div class="notice notice-success">Atendimento concluído. O registro está no histórico clínico.</div>';
  }

  return `
    <section class="panel patient-panel" aria-labelledby="patient-heading">
      <div class="patient-header">
        <div class="avatar" aria-hidden="true">${escapeHtml(patient.name.slice(0, 1).toUpperCase())}</div>
        <div>
          <p class="eyebrow">Perfil do paciente</p>
          <h2 id="patient-heading">${escapeHtml(patient.name)}</h2>
          <p class="patient-subtitle">${patient.age} anos <span aria-hidden="true">·</span> <span class="fictional-tag">DADOS FICTÍCIOS</span></p>
        </div>
      </div>
      ${state.message && state.messageKind === "error" && !activeVisit ? `<div class="notice notice-error" role="alert">${escapeHtml(state.message)}</div>` : ""}
      <div class="patient-facts">
        <div class="fact-card">
          <span class="fact-label">CPF</span>
          <strong>${escapeHtml(patient.fictionalCpf)}</strong>
          <small>Identificador de demonstração</small>
        </div>
        <div class="fact-card">
          <span class="fact-label">Doenças crônicas</span>
          ${showOptionalList(patient.chronicConditions)}
        </div>
        <div class="fact-card">
          <span class="fact-label">Medicamentos em uso</span>
          ${showOptionalList(patient.medications)}
        </div>
      </div>
      ${
        appointment
          ? `<div class="selected-appointment"><span>Agendamento selecionado</span><strong>${escapeHtml(formatDateTime(appointment.startsAt))}</strong><span class="status-pill status-${appointment.status}">${STATUS_LABELS[appointment.status]}</span></div>`
          : ""
      }
      ${actionContent}
      <section class="history-section" aria-labelledby="history-heading">
        <div class="section-heading">
          <div><p class="eyebrow">Registros anteriores e atuais</p><h3 id="history-heading">Histórico clínico</h3></div>
          <span class="history-count">${visits.length} ${visits.length === 1 ? "registro" : "registros"}</span>
        </div>
        ${renderVisitHistory(visits)}
      </section>
    </section>
  `;
}

function render(state: AppState, root: HTMLElement): void {
  root.innerHTML = `
    <header class="topbar">
      <a class="brand" href="#" aria-label="Clínica, início">
        <span class="brand-mark" aria-hidden="true">+</span>
        <span>clínica<span class="brand-dot">.</span></span>
      </a>
      <div class="topbar-right">
        <span class="demo-badge"><span aria-hidden="true"></span> Ambiente de demonstração</span>
        <span class="provider-label"><span class="provider-avatar" aria-hidden="true">P</span> Profissional de saúde</span>
      </div>
    </header>
    <main class="page-shell">
      <section class="page-intro">
        <div>
          <p class="eyebrow">Painel clínico</p>
          <h1>Bom dia, profissional</h1>
          <p class="intro-copy">Acompanhe sua agenda e registre atendimentos em um só lugar.</p>
        </div>
        <p class="privacy-note"><span aria-hidden="true">i</span> Demonstração com dados exclusivamente fictícios.</p>
      </section>
      ${state.message && state.messageKind !== "" && state.selectedPatientId === null ? `<div class="notice notice-${state.messageKind}" role="${state.messageKind === "error" ? "alert" : "status"}">${escapeHtml(state.message)}</div>` : ""}
      <div class="workspace-grid">
        ${renderAgenda(state)}
        ${renderPatientPanel(state)}
      </div>
      <footer class="page-footer">Demonstração local · Não utilizar com dados de pacientes reais</footer>
    </main>
  `;
}

function getFormValue(formData: FormData, name: keyof VisitDraft): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function parseOptionalMeasurement(
  value: string,
  fieldLabel: string,
): number | null {
  if (value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${fieldLabel}: informe um número maior que zero.`);
  }
  return parsed;
}

function createVisit(formData: FormData, patientId: string, appointmentId: string): Visit {
  const draft: VisitDraft = {
    notes: getFormValue(formData, "notes"),
    systolicPressure: getFormValue(formData, "systolicPressure"),
    diastolicPressure: getFormValue(formData, "diastolicPressure"),
    heartRate: getFormValue(formData, "heartRate"),
    temperature: getFormValue(formData, "temperature"),
    respiratoryRate: getFormValue(formData, "respiratoryRate"),
    oxygenSaturation: getFormValue(formData, "oxygenSaturation"),
    heightCm: getFormValue(formData, "heightCm"),
  };

  const systolicPressure = parseOptionalMeasurement(
    draft.systolicPressure,
    "Pressão sistólica",
  );
  const diastolicPressure = parseOptionalMeasurement(
    draft.diastolicPressure,
    "Pressão diastólica",
  );
  if ((systolicPressure === null) !== (diastolicPressure === null)) {
    throw new Error(
      "Informe as pressões sistólica e diastólica juntas ou deixe ambas em branco.",
    );
  }

  const oxygenSaturation = parseOptionalMeasurement(
    draft.oxygenSaturation,
    "Saturação de oxigênio",
  );
  if (oxygenSaturation !== null && oxygenSaturation > 100) {
    throw new Error("Saturação de oxigênio: informe um valor de até 100%.");
  }

  const vitalSigns: VitalSigns = {
    systolicPressure,
    diastolicPressure,
    heartRate: parseOptionalMeasurement(draft.heartRate, "Frequência cardíaca"),
    temperature: parseOptionalMeasurement(draft.temperature, "Temperatura"),
    respiratoryRate: parseOptionalMeasurement(
      draft.respiratoryRate,
      "Frequência respiratória",
    ),
    oxygenSaturation,
  };

  return {
    id: crypto.randomUUID(),
    patientId,
    appointmentId,
    recordedAt: new Date().toISOString(),
    notes: draft.notes || null,
    vitalSigns,
    heightCm: parseOptionalMeasurement(draft.heightCm, "Altura"),
  };
}

function readDraft(formData: FormData): VisitDraft {
  return {
    notes: getFormValue(formData, "notes"),
    systolicPressure: getFormValue(formData, "systolicPressure"),
    diastolicPressure: getFormValue(formData, "diastolicPressure"),
    heartRate: getFormValue(formData, "heartRate"),
    temperature: getFormValue(formData, "temperature"),
    respiratoryRate: getFormValue(formData, "respiratoryRate"),
    oxygenSaturation: getFormValue(formData, "oxygenSaturation"),
    heightCm: getFormValue(formData, "heightCm"),
  };
}

function persistData(state: AppState, nextData: AppData): void {
  saveAppData(nextData);
  state.data = nextData;
  state.message = "";
  state.messageKind = "";
}

export function mountApp(root: HTMLElement): void {
  let data: AppData;
  try {
    data = loadAppData();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar os dados da demonstração.";
    root.innerHTML = `
      <main class="fatal-screen">
        <div class="fatal-card">
          <span class="brand-mark" aria-hidden="true">!</span>
          <p class="eyebrow">Não foi possível iniciar</p>
          <h1>Os dados não foram carregados</h1>
          <p role="alert">${escapeHtml(message)}</p>
          <p class="muted">Nenhum dado foi substituído. Resolva o problema do armazenamento e recarregue a página.</p>
        </div>
      </main>
    `;
    return;
  }

  const state: AppState = {
    data,
    selectedDate: localDateValue(new Date()),
    selectedAppointmentId: null,
    selectedPatientId: null,
    draft: { ...EMPTY_DRAFT },
    message: "",
    messageKind: "",
  };

  const updateView = () => render(state, root);
  updateView();

  root.addEventListener("change", (event) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement &&
      target.name === "selectedDate"
    ) {
      state.selectedDate = target.value;
      state.selectedAppointmentId = null;
      state.selectedPatientId = null;
      state.draft = { ...EMPTY_DRAFT };
      state.message = "";
      state.messageKind = "";
      updateView();
    }
  });

  root.addEventListener("input", (event) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      const field = target.name as keyof VisitDraft;
      if (field in state.draft) {
        state.draft[field] = target.value;
      }
    }
  });

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest<HTMLButtonElement>("button[data-action]");
    if (!button) {
      return;
    }

    const appointmentId = button.dataset.appointmentId;
    const action = button.dataset.action;

    if (action === "open-patient") {
      state.selectedAppointmentId = appointmentId ?? null;
      state.selectedPatientId = button.dataset.patientId ?? null;
      state.draft = { ...EMPTY_DRAFT };
      state.message = "";
      state.messageKind = "";
      updateView();
      return;
    }

    if (!appointmentId) {
      return;
    }

    const appointment = state.data.appointments.find(
      (item) => item.id === appointmentId,
    );
    if (!appointment) {
      state.message = "Não foi possível localizar este agendamento.";
      state.messageKind = "error";
      updateView();
      return;
    }

    try {
      if (action === "mark-arrived" && appointment.status === "scheduled") {
        const nextData: AppData = {
          ...state.data,
          appointments: state.data.appointments.map((item) =>
            item.id === appointmentId ? { ...item, status: "waiting" } : item,
          ),
        };
        persistData(state, nextData);
      } else if (action === "start-visit" && appointment.status === "waiting") {
        const nextData: AppData = {
          ...state.data,
          appointments: state.data.appointments.map((item) =>
            item.id === appointmentId
              ? { ...item, status: "in-progress" }
              : item,
          ),
        };
        persistData(state, nextData);
        state.draft = { ...EMPTY_DRAFT };
      } else {
        state.message = "Esta ação não está disponível para o estado atual.";
        state.messageKind = "error";
      }
    } catch (error) {
      state.message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o agendamento.";
      state.messageKind = "error";
    }

    updateView();
  });

  root.addEventListener("submit", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement) || target.id !== "visit-form") {
      return;
    }

    event.preventDefault();
    const formData = new FormData(target);
    state.draft = readDraft(formData);

    const appointmentId = state.selectedAppointmentId;
    const patientId = state.selectedPatientId;
    if (!appointmentId || !patientId) {
      state.message = "Selecione um agendamento antes de salvar.";
      state.messageKind = "error";
      updateView();
      return;
    }

    const appointment = state.data.appointments.find(
      (item) => item.id === appointmentId,
    );
    if (
      !appointment ||
      appointment.patientId !== patientId ||
      appointment.status !== "in-progress"
    ) {
      state.message =
        "O agendamento não está disponível para conclusão. Confira a agenda e tente novamente.";
      state.messageKind = "error";
      updateView();
      return;
    }

    try {
      const visit = createVisit(formData, patientId, appointmentId);
      const nextData: AppData = {
        ...state.data,
        appointments: state.data.appointments.map((item) =>
          item.id === appointmentId ? { ...item, status: "attended" } : item,
        ),
        visits: [...state.data.visits, visit],
      };
      persistData(state, nextData);
      state.draft = { ...EMPTY_DRAFT };
      state.message = "Atendimento salvo e concluído.";
      state.messageKind = "success";
    } catch (error) {
      state.message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o atendimento.";
      state.messageKind = "error";
    }

    updateView();
  });
}
