import { ResultsDashboardShell } from "@/features/results/results-dashboard-shell";

const ResultsPage = async ({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) => {
  const { repoId } = await params;

  return (
    <main id="main-content">
      <ResultsDashboardShell repoId={repoId} />
    </main>
  );
};

export default ResultsPage;
