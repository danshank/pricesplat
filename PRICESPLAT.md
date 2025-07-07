# Pricesplat

When sharing expenses across a group of people, the owner will set up the group and invite other members. By default, once invited, anyone can invite additional members to the group.

Once members are added, they can add expenses to the group. By default, these are split evenly amongst all members. After a given expense is added, other members can decide to opt out of specific expenses. Additionally, the payee of an expense can decide to include, or exclude specific members from the expense. Any user may also submit an expense on behalf of another member, but that member will be notified of the expense and can accept or reject it before it is added to the group. Until then, the expense is pending.

After an expense is added, the amounts owed by each member are calculated. The cost of the expense is split evenly amongst the members who are part of that expense.

Once all amounts owed are calculated, each user will, in total, either owe, or be owed some amount. The balance of any individual member is the sum of all amounts they are the payee of, minus the sum of all amounts they are a payor on.

Once expenses are added, and balances are calculated, debts can be simplified. During simplification, each member is sorted from the most owed to the least owed. The user with the most debt is paired with users with the most owed until the debt is paid off. This repeats until all debits and credits are zeroed across all members.

## Pending invitations and balances (open question)

Should a user who is added to the group be added to existing expenses? If we add them, then everyone's balance will be recalculated. Maybe if we have a way for invitations to be pending, we can show the current expected amount, but also with the caveat that, given the current status of the group, some people aren't included in the current calculations.

## Wishes

Way to create a group from a chat automatically.
Add tags to manage categories of expenses along with the users included automatically in a category.
Scan receipt to add expenses
