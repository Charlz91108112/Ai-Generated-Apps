import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseFormData } from "./ExpenseForm";
import { useToast } from "@/hooks/use-toast";

interface ExpenseTableProps {
  expenses: ExpenseFormData[];
  onDelete: (index: number) => void;
}

const ExpenseTable = ({ expenses, onDelete }: ExpenseTableProps) => {
  const { toast } = useToast();

  const handleDelete = (index: number) => {
    onDelete(index);
    toast({
      title: "Success",
      description: "Expense deleted successfully",
    });
  };

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense, index) => (
            <TableRow key={index}>
              <TableCell>{expense.date}</TableCell>
              <TableCell className="capitalize">{expense.category}</TableCell>
              <TableCell>{expense.amount}</TableCell>
              <TableCell>{expense.currency}</TableCell>
              <TableCell>{expense.notes}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTable;