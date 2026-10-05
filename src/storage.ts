import { createSampleData } from "./sample-data";
import type {
  AppData,
  Appointment,
  AppointmentStatus,
  Patient,
  VitalSigns,
  Visit,
} from "./types";

const STORAGE_KEY = "atendimento-clinico-demo-v1";
const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "waiting",
  "in-progress",
  "attended",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableStringList(value: unknown): value is string[] | null {
  return (
    value === null ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}

function isPatient(value: unknown): value is Patient {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    typeof value.age === "number" &&
    Number.isInteger(value.age) &&
    value.age >= 0 &&
    isString(value.fictionalCpf) &&
    isNullableStringList(value.chronicConditions) &&
    isNullableStringList(value.medications)
  );
}

function isAppointment(value: unknown): value is Appointment {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.patientId) &&
    isString(value.startsAt) &&
    !Number.isNaN(Date.parse(value.startsAt)) &&
    APPOINTMENT_STATUSES.includes(value.status as AppointmentStatus)
  );
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isVitalSigns(value: unknown): value is VitalSigns {
  return (
    isRecord(value) &&
    isNullableNumber(value.systolicPressure) &&
    isNullableNumber(value.diastolicPressure) &&
    isNullableNumber(value.heartRate) &&
    isNullableNumber(value.temperature) &&
    isNullableNumber(value.respiratoryRate) &&
    isNullableNumber(value.oxygenSaturation)
  );
}

function isVisit(value: unknown): value is Visit {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.patientId) &&
    (value.appointmentId === null || isString(value.appointmentId)) &&
    isString(value.recordedAt) &&
    !Number.isNaN(Date.parse(value.recordedAt)) &&
    (value.notes === null || isString(value.notes)) &&
    isVitalSigns(value.vitalSigns) &&
    isNullableNumber(value.heightCm)
  );
}

function isAppData(value: unknown): value is AppData {
  return (
    isRecord(value) &&
    Array.isArray(value.patients) &&
    value.patients.every(isPatient) &&
    Array.isArray(value.appointments) &&
    value.appointments.every(isAppointment) &&
    Array.isArray(value.visits) &&
    value.visits.every(isVisit)
  );
}

export function loadAppData(): AppData {
  let serialized: string | null;

  try {
    serialized = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    throw new Error(
      "Não foi possível acessar o armazenamento local deste navegador.",
    );
  }

  if (serialized === null) {
    const sampleData = createSampleData();
    saveAppData(sampleData);
    return sampleData;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error(
      "Os dados locais estão inválidos. Eles não foram substituídos; limpe os dados deste site para reiniciar a demonstração.",
    );
  }

  if (!isAppData(parsed)) {
    throw new Error(
      "Os dados locais não correspondem ao formato esperado. Eles não foram substituídos; limpe os dados deste site para reiniciar a demonstração.",
    );
  }

  return parsed;
}

export function saveAppData(data: AppData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error(
      "Não foi possível salvar no armazenamento local. Verifique o espaço disponível e as permissões do navegador; as alterações continuam na tela.",
    );
  }
}
