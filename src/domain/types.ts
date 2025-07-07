import { z } from 'zod'

export const userIdSchema = z.string().uuid();
export type UserId = z.infer<typeof userIdSchema>;

export const userSchema = z.object({
  id: userIdSchema,
  displayName: z.string(),
  email: z.string().email(),
})
export type User = z.infer<typeof userSchema>

// Invitation system
export const invitationStatusSchema = z.enum(['pending', 'accepted', 'rejected']);
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;

export const groupIdSchema = z.string().uuid();
export type GroupId = z.infer<typeof groupIdSchema>;

export const emailInvitationSchema = z.object({
  id: z.string().uuid(),
  groupId: groupIdSchema,
  inviterId: userIdSchema,
  inviteeEmail: z.string().email(),
  status: invitationStatusSchema,
  createdAt: z.date(),
})
export type EmailInvitation = z.infer<typeof emailInvitationSchema>

// Expense system
export const expenseStatusSchema = z.enum(['pending', 'accepted', 'rejected']);
export type ExpenseStatus = z.infer<typeof expenseStatusSchema>;

export const expenseSchema = z.object({
  id: z.string().uuid(),
  payeeId: userIdSchema, // Who paid for the expense and needs to be reimbursed
  submittedById: userIdSchema, // Who actually submitted the expense
  amount: z.number(),
  date: z.date(),
  description: z.string(),
  category: z.string(), // Tag?
  status: expenseStatusSchema.default('accepted'),
  participantIds: z.array(userIdSchema),
  createdAt: z.date(),
})
export type Expense = z.infer<typeof expenseSchema>

// Balance system
export const balanceSchema = z.object({
  userId: userIdSchema,
  totalDebit: z.number(),
  totalCredit: z.number(),
})
export type Balance = z.infer<typeof balanceSchema>

export const debtSchema = z.object({
  debtorId: userIdSchema, // Who owes the money
  creditorId: userIdSchema, // Who is owed the money
  amount: z.number(),
})
export type Debt = z.infer<typeof debtSchema>

export const groupFinancesSchema = z.object({
  expenses: z.array(expenseSchema),
  balances: z.array(balanceSchema),
  debts: z.array(debtSchema),
})
export type GroupFinances = z.infer<typeof groupFinancesSchema>

export const groupSchema = z.object({
  id: groupIdSchema,
  name: z.string(),
  creatorId: userIdSchema,
  members: z.array(userSchema),
  emailInvitations: z.array(emailInvitationSchema),
  finances: groupFinancesSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type Group = z.infer<typeof groupSchema>