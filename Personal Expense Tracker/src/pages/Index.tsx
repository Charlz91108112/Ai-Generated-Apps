import { useState } from "react";
import ExpenseForm, { ExpenseFormData } from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import Dashboard from "@/components/Dashboard";
import CursorSplash from "@/components/CursorSplash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [expenses, setExpenses] = useState<ExpenseFormData[]>([]);

  const handleAddExpense = (expense: ExpenseFormData) => {
    setExpenses([...expenses, expense]);
  };

  const handleDeleteExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-premium p-4 md:p-8">
      <CursorSplash />
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-primary text-center mb-8">
          Expense Tracker
        </h1>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <Dashboard expenses={expenses} />
          </TabsContent>

          <TabsContent value="add">
            <div className="max-w-md mx-auto">
              <ExpenseForm onSubmit={handleAddExpense} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <ExpenseTable expenses={expenses} onDelete={handleDeleteExpense} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;