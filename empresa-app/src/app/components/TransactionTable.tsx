import { DataGrid, GridColDef, GridFooter } from "@mui/x-data-grid";

interface TransactionTableProps {
  transactions: {
    id: number;
    descricao: string;
    valor: number;
    tipoDeTransacao: string;
  }[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  const columns: GridColDef[] = [
    { field: "descricao", headerName: "Descrição", width: 200 },
    {
      field: "valor",
      headerName: "Valor",
      width: 150,
      renderCell: (params) =>
        params.value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      field: "tipoDeTransacao",
      headerName: "Tipo de Transação",
      width: 150,
      renderCell: (params) =>
        params.value === "ENTRADA" ? "✅ Entrada" : "❌ Saída",
    },
  ];

  return (
    <div style={{ height: 400, width: "48%"}}>
      <DataGrid
        rows={transactions}
        columns={columns}
        pagination
        pageSizeOptions={[5, 10, 20]} // Page size options
        slots={{
          footer: () => (
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
