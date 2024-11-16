import { DataGrid, GridFooter } from "@mui/x-data-grid";

interface TransactionTableProps {
  transactions: {
    id: number;
    descricao: string;
    valor: number;
    tipoDeTransacao: string;
  }[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const columns = [
    { field: "descricao", headerName: "Description", width: 200 },
    { 
      field: "valor", 
      headerName: "Value", 
      width: 150,
      renderCell: (params: { value: { toLocaleString: (arg0: string, arg1: { style: string; currency: string; }) => any; }; }) =>
        params.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    },
    { 
      field: "tipoDeTransacao", 
      headerName: "Type", 
      width: 150,
      renderCell: (params: { value: string; }) =>
        params.value === "ENTRADA" ? "✅ Entry" : "❌ Exit",
    },
  ];

  return (
    <div style={{ height: 600, width: "30%", marginLeft: 120 }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        pagination
        pageSizeOptions={[5, 10, 20]} // Page size options
        components={{
          Footer: () => (
            <GridFooter
              sx={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#f4f4f4",
                padding: "10px",
              }}
            >
              <span>Customized with ❤️ - Financial Control</span>
            </GridFooter>
          ),
        }}
      />
    </div>
  );
}
