export interface IAnnualNewMemberEmail {
  email: string;
  memberFirstName: string;
  dueDate: string;
  membershipType: string;
  combinedAnnualAndFirstMonthFee: number;
  invoiceLink: string;
}

export interface IExistingMemberEmail {
  email: string;
  memberFirstName: string;
  membershipType: string;
  totalMonthlyAmount: number;
  invoiceLink: string;
}

export interface IDateParams {
  currentDate: Date;
  currentDateString: string;
  currentMonth: number;
  currentYear: number;
}
