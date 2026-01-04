export enum BlueBookEntryStatus {
  NEW = "NEW",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED",
}

export type BlueBookEntry = {
  id: number;
  title: string;
  body: string;
  from_name: string;
  to_name: string;
  status: BlueBookEntryStatus;
};
