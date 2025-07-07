import type { Balance, Debt, Expense, GroupFinances, UserId } from "./types";

export interface ExpenseService {
  addExpense(expense: Expense, group: GroupFinances): Promise<GroupFinances>;
  addExpenseToBalances(expense: Expense, balances: Balance[]): Promise<Balance[]>;
  calculateBalances(expenses: Expense[]): Promise<Balance[]>;
  calculateDebts(balances: Balance[]): Promise<Debt[]>;
}

export class ExpenseServiceImpl implements ExpenseService {
  async addExpense(expense: Expense, group: GroupFinances): Promise<GroupFinances> {
    const { status } = expense;
    if (status !== "accepted") {
      throw new Error("Expense must be accepted (for now) to be added to a group");
      // TODO: Pending expenses should be added to the group, but calculate an alternate balance
    }
    const { balances } = group;
    const newBalances = await this.addExpenseToBalances(expense, balances);
    const newDebts = await this.calculateDebts(newBalances);

    const newGroup = { ...group, expenses: [...group.expenses, expense], balances: newBalances, debts: newDebts };
    return newGroup;
  }

  async addExpenseToBalances(expense: Expense, balances: Balance[]): Promise<Balance[]> {
    const { payeeId, participantIds, amount } = expense;
    const newBalanceMap = new Map(balances.map((b) => [b.userId, b]));
    if (!newBalanceMap.has(payeeId)) {
      throw new Error(`Payee ${payeeId} not found in group`);
    }
    newBalanceMap.set(payeeId, {
        ...newBalanceMap.get(payeeId)!,
        totalCredit: newBalanceMap.get(payeeId)!.totalCredit + amount,
    });
    const amountPerParticipant = amount / participantIds.length;
    for (const participantId of participantIds) {
        if (!newBalanceMap.has(participantId)) {
            throw new Error(`Participant ${participantId} not found in group`);
        }
        newBalanceMap.set(participantId, {
            ...newBalanceMap.get(participantId)!,
            totalDebit: newBalanceMap.get(participantId)!.totalDebit + amountPerParticipant,
        });
    }

    return Array.from(newBalanceMap.values());
  }

  async calculateBalances(expenses: Expense[]): Promise<Balance[]> {
    const balanceMap = new Map<UserId, Balance>();
    expenses.forEach((expense) => {
      const { payeeId, participantIds, amount } = expense;
      const payeeBalance = balanceMap.get(payeeId) || { userId: payeeId, totalCredit: 0, totalDebit: 0 };
      const amountPerParticipant = amount / participantIds.length;
      payeeBalance.totalCredit += amount;
      balanceMap.set(payeeId, payeeBalance);
      participantIds.forEach((participantId) => {
        const participantBalance = balanceMap.get(participantId) || { userId: participantId, totalCredit: 0, totalDebit: 0 };
        participantBalance.totalDebit += amountPerParticipant;
        balanceMap.set(participantId, participantBalance);
      });
    });
    return Array.from(balanceMap.values());
  }

  async calculateDebts(balances: Balance[]): Promise<Debt[]> {
    // Calculate net balances
    const netBalances = balances.map((b) => ({
        userId: b.userId,
        netBalance: b.totalCredit - b.totalDebit,
    }));
    const sortedNetBalances = netBalances.sort((a, b) => b.netBalance - a.netBalance);
    // Starting at either end, create debts to fill the highest net balances with the lowest net balances
    const debts: Debt[] = [];
    let creditIndex = 0;
    let debitIndex = sortedNetBalances.length - 1;
    while (creditIndex < debitIndex) {
        const creditBalance = sortedNetBalances[creditIndex];
        const debitBalance = sortedNetBalances[debitIndex];
        const debt = {
            creditorId: creditBalance.userId,
            debtorId: debitBalance.userId,
            amount: Math.min(creditBalance.netBalance, -debitBalance.netBalance),
        };
        debts.push(debt);
        const creditorFullyPaid = creditBalance.netBalance <= -debitBalance.netBalance;
        const debtorFullyPaid = creditBalance.netBalance >= -debitBalance.netBalance;
        creditBalance.netBalance -= debt.amount;
        debitBalance.netBalance += debt.amount;
        // Either the creditor is fully paid their credit, or the debitor has fully paid their debt
        // If the credit and debit are equal, both conditions are true
        if (creditorFullyPaid) {
            creditIndex++;
        } 
        if (debtorFullyPaid) {
            debitIndex--;
        }
    }
    return debts;
  }
}