CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    creator_id UUID REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TYPE InvitationStatus as ENUM ('pending', 'accepted', 'rejected');

CREATE TYPE ExpenseStatus as ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE IF NOT EXISTS EmailInvitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES Groups ON UPDATE CASCADE ON DELETE CASCADE,
    inviter_id UUID REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE,
    invitee_email VARCHAR(50) NOT NULL,
    status InvitationStatus NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS Expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES Groups ON UPDATE CASCADE ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    date DATE NOT NULL,
    description text,
    category text,
    status ExpenseStatus NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS Balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE,
    group_id UUID REFERENCES Groups ON UPDATE CASCADE ON DELETE CASCADE,
    total_debit FLOAT,
    total_Credit FLOAT
);

CREATE TABLE IF NOT EXISTS Debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debtor_id UUID REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE,
    creditor_id UUID REFERENCES Users ON UPDATE CASCADE ON DELETE CASCADE,
    group_id UUID REFERENCES Groups ON UPDATE CASCADE ON DELETE CASCADE,
    amount FLOAT
);

CREATE TABLE IF NOT EXISTS UsersGroups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    group_id UUID,

    FOREIGN KEY (user_id) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES Groups(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UsersExpenses (
    id UUID PRIMARY KEY,
    user_id UUID,
    expense_id UUID,

    FOREIGN KEY (user_id) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (expense_id) REFERENCES Expenses(id) ON UPDATE CASCADE ON DELETE CASCADE
);
