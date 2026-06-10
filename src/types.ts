/**
 * Safe Haven Types
 */

export interface StudentProfile {
  nickname: string;
  semester: string; // "1st Sem" to "8th Sem"
  branch: string; // "Computer Science", "Electronics & Communication", "Electrical", "Mechanical", "Civil", "Other"
  stressLevel: number; // 1 to 10
  stressReason: string; // "exams", "backlogs", "attendance", "placements", "peer_pressure", "general"
  supportCircleName?: string;
  supportCircleInfo?: string;
  supportCircleRelation?: string;
  enableSupportCircle?: boolean;
}

export type CompanionId = "purr" | "luma" | "cirrus" | "sprout";

export interface Companion {
  id: CompanionId;
  name: string;
  title: string;
  avatar: string; // icon-style placeholder
  motto: string;
  description: string;
  style: string; // visual layout rules or styling context
  ambientAccent: string; // Tailwind class references for soft backgrounds
  secondaryAccent: string; // Tailwind border level colorings
  badgeColor: string; // Tailwind badge classes
  empathyInstruction: string; // system context instructions
  chatStarter: string;
}

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface AcademicTask {
  id: string;
  title: string;
  category: "syllabus" | "lab_record" | "placement" | "other";
  status: "pending" | "progress" | "done";
  subtasks: { id: string; text: string; done: boolean }[];
  semester: string;
}

export interface WorryCommit {
  id: string;
  hash: string;
  message: string;
  branch: string;
  timestamp: string;
}
