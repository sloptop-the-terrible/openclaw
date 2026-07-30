import type { SystemAgentSetupDetectResult } from "../../api/types.ts";
import { t } from "../../i18n/index.ts";

export type ModelSetupPrepareOption = {
  id: "ollama" | "llama-cpp";
  brandId?: string;
  label: string;
  hint?: string;
  facts?: readonly string[];
  buttonLabel: string;
  featured?: boolean;
  activateAfterPrepare?: boolean;
  icon?: string;
  website?: string;
};

export function listModelSetupPrepareOptions(
  result: SystemAgentSetupDetectResult,
): ModelSetupPrepareOption[] {
  const prepareChoices: readonly ModelSetupPrepareOption[] = [
    {
      id: "ollama",
      brandId: "ollama",
      label: t("modelSetup.prepare.ollamaLabel"),
      hint: t("modelSetup.prepare.ollamaHint"),
      buttonLabel: t("modelSetup.prepare.ollamaButton"),
    },
    {
      id: "llama-cpp",
      brandId: "llama-cpp",
      label: t("modelSetup.prepare.llamaCppLabel"),
      hint: t("modelSetup.prepare.llamaCppHint"),
      facts: [
        t("modelSetup.prepare.llamaCppModel"),
        t("modelSetup.prepare.llamaCppDownload"),
        t("modelSetup.prepare.llamaCppMemory"),
      ],
      buttonLabel: t("modelSetup.prepare.llamaCppButton"),
      featured: true,
      activateAfterPrepare: true,
    },
  ];
  const presented = [
    ...result.manualProviders,
    ...(result.authOptions ?? []),
    ...(result.recommendedInstalls ?? []),
  ];
  return prepareChoices
    .filter(
      (choice) =>
        !result.candidates.some(
          (candidate) =>
            candidate.kind === `provider-auto:${choice.id}` ||
            candidate.modelRef.startsWith(`${choice.id}/`),
        ),
    )
    .map((choice) => {
      const wire = presented.find((entry) => entry.id === choice.id);
      return wire ? Object.assign({}, choice, wire, { id: choice.id }) : choice;
    });
}

export function findPreparedModelCandidate(
  result: SystemAgentSetupDetectResult,
  providerId: ModelSetupPrepareOption["id"],
) {
  return result.candidates.find(
    (candidate) =>
      candidate.kind === `provider-auto:${providerId}` ||
      candidate.modelRef.startsWith(`${providerId}/`),
  );
}
