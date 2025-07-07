import { describe, it, expect } from 'vitest';
import { ExpenseServiceImpl } from './expenses';
import type { Balance, Expense } from './types';

describe('ExpenseServiceImpl', () => {
  const expenseService = new ExpenseServiceImpl();
  describe('calculateDebts', () => {
    it('should calculate debts correctly when there are multiple debts', async () => {
      const balances: Balance[] = [
        {
          userId: 'user-1',
          totalCredit: 100,
          totalDebit: 50,
        },
        {
          userId: 'user-2',
          totalCredit: 30,
          totalDebit: 80,
        },
      ];
      const result = await expenseService.calculateDebts(balances);
      expect(result).toEqual([
        {
          creditorId: 'user-1',
          debtorId: 'user-2',
          amount: 50,
        },
      ]);
    });

    it('should calculate net balances correctly', async () => {
      const balances: Balance[] = [
        {
          userId: 'user-1',
          totalCredit: 100,
          totalDebit: 50,
        },
        {
          userId: 'user-2',
          totalCredit: 30,
          totalDebit: 80,
        },
        {
          userId: 'user-3',
          totalCredit: 20,
          totalDebit: 20,
        },
      ];

      const result = await expenseService.calculateDebts(balances);
      expect(result).toEqual([
        {
          creditorId: 'user-1',
          debtorId: 'user-2',
          amount: 50,
        },
      ]);
    });

  });

  describe('calculateBalances', () => {
    it('should calculate balances correctly', async () => {
      const expenses: Expense[] = [
        {
          id: 'expense-1',
          payeeId: 'user-1',
          participantIds: ['user-2', 'user-3'],
          amount: 100,
          status: 'pending',
          submittedById: 'user-1',
          date: new Date(),
          description: 'Test expense',
          category: 'Test category',
          createdAt: new Date(),
        },
      ];
      const result = await expenseService.calculateBalances(expenses);
      expect(result).toEqual([
        {
          userId: 'user-1',
          totalCredit: 100,
          totalDebit: 0,
        },
        {
          userId: 'user-2',
          totalCredit: 0,
          totalDebit: 50,
        },
        {
          userId: 'user-3',
          totalCredit: 0,
          totalDebit: 50,
        },
      ]);
    });

    it('should calculate balances correctly when there are multiple expenses', async () => {
      const expenses: Expense[] = [
        {
          id: 'expense-1',
          payeeId: 'user-1',
          participantIds: ['user-2', 'user-3'],
          amount: 100,
          status: 'pending',
          submittedById: 'user-1',
          date: new Date(),
          description: 'Test expense',
          category: 'Test category',
          createdAt: new Date(),
        },
        {
          id: 'expense-2',
          payeeId: 'user-2',
          participantIds: ['user-1', 'user-3'],
          amount: 100,
          status: 'pending',
          submittedById: 'user-2',
          date: new Date(),
          description: 'Test expense',
          category: 'Test category',
          createdAt: new Date(),
        },
      ];
      const result = await expenseService.calculateBalances(expenses);
      expect(result).toEqual([
        {
          userId: 'user-1',
          totalCredit: 100,
          totalDebit: 50,
        },
        {
          userId: 'user-2',
          totalCredit: 100,
          totalDebit: 50,
        },
        {
          userId: 'user-3',
          totalCredit: 0,
          totalDebit: 100,
        },
      ]);
    });
    it('should calculate balances correctly when the payee is a participant', async () => {
      const expenses: Expense[] = [
        {
          id: 'expense-1',
          payeeId: 'user-1',
          participantIds: ['user-1', 'user-2', 'user-3'],
          amount: 60,
          status: 'pending',
          submittedById: 'user-1',
          date: new Date(),
          description: 'Test expense',
          category: 'Test category',
          createdAt: new Date(),
        },
      ];
      const result = await expenseService.calculateBalances(expenses);
      expect(result).toEqual([
        {
          userId: 'user-1',
          totalCredit: 60,
          totalDebit: 20,
        },
        {
          userId: 'user-2',
          totalCredit: 0,
          totalDebit: 20,
        },
        {
          userId: 'user-3',
          totalCredit: 0,
          totalDebit: 20,
        },
      ]);
    });
  });
}); 