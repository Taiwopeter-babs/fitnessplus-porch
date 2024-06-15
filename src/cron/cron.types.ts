export interface IAnnualNewMembersEmail {
  email: string;
  memberFirstName: string;
  dueDate: string;
  membershipType: string;
  combinedAnnualAndFirstMonthFee: number;
  invoiceLink: string;
}

export interface IExistingMembersEmail {
  membershipType: string;
  serviceName: string;
  totalMonthlyAmount: number;
  invoiceLink: string;
}

export interface IDateParams {
  currentDateString: string;
  currentMonth: number;
  currentYear: number;
}
