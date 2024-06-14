export const newMembersEmailTemplate = `
<html>
  <body>
    <p>
      Dear [[var:memberFirstName]]
    </p>
    <p>
      <strong>You absolutely smashed it this past month by showing up. Great Work!</strong>
    </p>
    
    <p>
      This is a reminder that your annual membership subscription is due in less than <b>seven (7) days</b>. This subscription payment includes the annual fee and additional services (add-ons) provided by Fitness+ Gym.
      <p>
        Please note that the first month combines the annual fee and add-ons, while subsequent months include just the add-ons.
      </p>
      Please see your membership details, subscription due dates and links to invoices. 
    </p>
    
    <p>
      <b>MembershipType:</b> [[var:membershipType]]
    </p>
    
     <p>
      <b>Due Date</b> [[var:dueDate]]
    </p>
    
    <p>
      <b>First Month Combined Subscription Invoice Link:</b> [[var:invoiceLink]]
    </p>
    
  </body>
</html>`;
