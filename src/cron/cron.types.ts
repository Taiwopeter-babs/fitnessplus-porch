export interface IAnnualNewMembersEmail {
  membershipType: string;
  totalSubscriptionAmount: number;
  invoiceLink: string;
}

export interface IExistingMembersEmail {
  serviceName: string;
  totalMonthlyAmount: number;
  invoiceLink: string;
}

export interface IDateParams {
  currentDateString: string;
  currentMonth: number;
  currentYear: number;
}
