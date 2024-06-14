export interface IAnnualNewMembersEmail {
  membershipType: string;
  firstMonthSubscriptionAmount: number;
  subsequentMonthlyAmount: number;
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
