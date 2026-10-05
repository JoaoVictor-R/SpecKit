export type AppointmentStatus =
  | "scheduled"
  | "waiting"
  | "in-progress"
  | "attended";

export interface Patient {
  id: string;
  name: string;
  age: number;
  fictionalCpf: string;
  chronicConditions: string[] | null;
  medications: string[] | null;
}

export interface Appointment {
  id: string;
  patientId: string;
  startsAt: string;
  status: AppointmentStatus;
}

export interface VitalSigns {
  systolicPressure: number | null;
  diastolicPressure: number | null;
  heartRate: number | null;
  temperature: number | null;
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
}

export interface Visit {
  id: string;
  patientId: string;
  appointmentId: string | null;
  recordedAt: string;
  notes: string | null;
  vitalSigns: VitalSigns;
  heightCm: number | null;
}

export interface AppData {
  patients: Patient[];
  appointments: Appointment[];
  visits: Visit[];
}

export interface VisitDraft {
  notes: string;
  systolicPressure: string;
  diastolicPressure: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  heightCm: string;
}
