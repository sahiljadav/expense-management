-- CreateTable
CREATE TABLE "User" (
    "UserID" SERIAL NOT NULL,
    "UserName" VARCHAR(250) NOT NULL,
    "EmailAddress" VARCHAR(500) NOT NULL,
    "Password" VARCHAR(250) NOT NULL,
    "MobileNo" VARCHAR(50) NOT NULL,
    "ProfileImage" VARCHAR(500),
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "People" (
    "PeopleID" SERIAL NOT NULL,
    "PeopleCode" VARCHAR(50),
    "Password" VARCHAR(250) NOT NULL,
    "PeopleName" VARCHAR(250) NOT NULL,
    "Email" VARCHAR(150) NOT NULL,
    "MobileNo" VARCHAR(50) NOT NULL,
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,
    "IsActive" BOOLEAN DEFAULT true,

    CONSTRAINT "People_pkey" PRIMARY KEY ("PeopleID")
);

-- CreateTable
CREATE TABLE "Category" (
    "CategoryID" SERIAL NOT NULL,
    "CategoryName" VARCHAR(250) NOT NULL,
    "LogoPath" VARCHAR(250),
    "IsExpense" BOOLEAN NOT NULL,
    "IsIncome" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Sequence" DECIMAL(65,30),
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "SubCategoryID" SERIAL NOT NULL,
    "CategoryID" INTEGER NOT NULL,
    "SubCategoryName" VARCHAR(250) NOT NULL,
    "LogoPath" VARCHAR(250),
    "IsExpense" BOOLEAN NOT NULL,
    "IsIncome" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Sequence" DECIMAL(65,30),
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("SubCategoryID")
);

-- CreateTable
CREATE TABLE "Project" (
    "ProjectID" SERIAL NOT NULL,
    "ProjectName" VARCHAR(250) NOT NULL,
    "ProjectLogo" VARCHAR(250),
    "ProjectStartDate" TIMESTAMP(3),
    "ProjectEndDate" TIMESTAMP(3),
    "ProjectDetail" VARCHAR(500),
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "IsActive" BOOLEAN DEFAULT true,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("ProjectID")
);

-- CreateTable
CREATE TABLE "Expense" (
    "ExpenseID" SERIAL NOT NULL,
    "ExpenseDate" TIMESTAMP(3) NOT NULL,
    "CategoryID" INTEGER,
    "SubCategoryID" INTEGER,
    "PeopleID" INTEGER NOT NULL,
    "ProjectID" INTEGER,
    "Amount" DECIMAL(65,30) NOT NULL,
    "ExpenseDetail" VARCHAR(500),
    "AttachmentPath" VARCHAR(250),
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("ExpenseID")
);

-- CreateTable
CREATE TABLE "Income" (
    "IncomeID" SERIAL NOT NULL,
    "IncomeDate" TIMESTAMP(3) NOT NULL,
    "CategoryID" INTEGER,
    "SubCategoryID" INTEGER,
    "PeopleID" INTEGER NOT NULL,
    "ProjectID" INTEGER,
    "Amount" DECIMAL(65,30) NOT NULL,
    "IncomeDetail" VARCHAR(500),
    "AttachmentPath" VARCHAR(250),
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("IncomeID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_EmailAddress_key" ON "User"("EmailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "People_Email_key" ON "People"("Email");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_SubCategoryID_fkey" FOREIGN KEY ("SubCategoryID") REFERENCES "SubCategory"("SubCategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_PeopleID_fkey" FOREIGN KEY ("PeopleID") REFERENCES "People"("PeopleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_ProjectID_fkey" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ProjectID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_SubCategoryID_fkey" FOREIGN KEY ("SubCategoryID") REFERENCES "SubCategory"("SubCategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_PeopleID_fkey" FOREIGN KEY ("PeopleID") REFERENCES "People"("PeopleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_ProjectID_fkey" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ProjectID") ON DELETE SET NULL ON UPDATE CASCADE;
