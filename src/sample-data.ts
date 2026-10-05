import type { AppData } from "./types";

function localDateAt(daysFromToday: number, time: string): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export function createSampleData(): AppData {
  return {
    patients: [
      {
        id: "patient-ana-lima",
        name: "Ana Lima",
        age: 42,
        fictionalCpf: "FICTÍCIO — 000.000.000-00",
        chronicConditions: ["Hipertensão (dado fictício)"],
        medications: ["Medicamento demonstrativo (dado fictício)"],
      },
      {
        id: "patient-bruno-souza",
        name: "Bruno Souza",
        age: 35,
        fictionalCpf: "FICTÍCIO — 000.000.000-00",
        chronicConditions: null,
        medications: null,
      },
      {
        id: "patient-carla-mendes",
        name: "Carla Mendes",
        age: 58,
        fictionalCpf: "FICTÍCIO — 000.000.000-00",
        chronicConditions: ["Diabetes tipo 2 (dado fictício)"],
        medications: ["Medicamento demonstrativo (dado fictício)"],
      },
      {
        id: "patient-diego-rocha",
        name: "Diego Rocha",
        age: 27,
        fictionalCpf: "FICTÍCIO — 000.000.000-00",
        chronicConditions: null,
        medications: [],
      },
    ],
    appointments: [
      {
        id: "appointment-ana",
        patientId: "patient-ana-lima",
        startsAt: localDateAt(0, "08:30"),
        status: "attended",
      },
      {
        id: "appointment-bruno",
        patientId: "patient-bruno-souza",
        startsAt: localDateAt(0, "09:15"),
        status: "waiting",
      },
      {
        id: "appointment-carla",
        patientId: "patient-carla-mendes",
        startsAt: localDateAt(0, "10:00"),
        status: "in-progress",
      },
      {
        id: "appointment-diego",
        patientId: "patient-diego-rocha",
        startsAt: localDateAt(0, "11:30"),
        status: "scheduled",
      },
      {
        id: "appointment-bruno-tomorrow",
        patientId: "patient-bruno-souza",
        startsAt: localDateAt(1, "09:00"),
        status: "scheduled",
      },
    ],
    visits: [
      {
        id: "visit-ana-previous",
        patientId: "patient-ana-lima",
        appointmentId: null,
        recordedAt: localDateAt(-30, "08:30"),
        notes: "Registro anterior fictício para demonstração.",
        vitalSigns: {
          systolicPressure: 120,
          diastolicPressure: 80,
          heartRate: 72,
          temperature: 36.6,
          respiratoryRate: 16,
          oxygenSaturation: 98,
        },
        heightCm: 165,
      },
    ],
  };
}
