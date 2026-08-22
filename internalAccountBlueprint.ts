import { GoogleGenerativeAI } from "@google/generative-ai"

const NUM_CAPABILITIES = 5
const NUM_ACH_SETTINGS = 2

interface SchemaProperty {
  label: string
  key: string
  type: string
  description?: string
  geminiPromptHint?: string
}

interface AccountNumberDetails {
  accountNumber1: string
  accountNumber1Type: string
  accountNumber2?: string
  accountNumber2Type?: string
}

interface RoutingNumberDetails {
  routingNumber1: string
  routingNumber1Type: string
  routingNumber2?: string
  routingNumber2Type?: string
}

interface PartyAddressDetails {
  partyAddressLine1: string
  partyAddressLine2?: string
  partyAddressLocality: string
  partyAddressRegion?: string
  partyAddressPostalCode: string
  partyAddressCountry: string
}

interface AccountCapability {
  direction: string
  paymentType: string
  identifier?: string
  paymentSubtypes?: string
  anyCurrency?: string
  currencies?: string
  connectionId?: string
  partyName?: string
  addressLine1?: string
  addressLine2?: string
  addressLocality?: string
  addressRegion?: string
  addressPostalCode?: string
  addressCountry?: string
}

interface ACHSetting {
  immediateOrigin: string
  immediateOriginName: string
  immediateDestination: string
  immediateDestinationName: string
  direction?: string
  connectionEndpointLabel?: string
}

interface InternalAccount {
  name: string
  currency: string
  partyName: string
  partyAddress: PartyAddressDetails
  accountNumbers: AccountNumberDetails
  routingNumbers: RoutingNumberDetails
  capabilities: AccountCapability[]
  achSettings: ACHSetting[]
  geminiAnalysisStatus?: string
  geminiValidationIssues?: string[]
  geminiEnrichmentSuggestions?: Record<string, any>
}

const accountNumberFields = (): SchemaProperty[] => [
  {
    label: "Account Number",
    key: "accountNumber1",
    type: "string",
    description: "The primary bank account number",
    geminiPromptHint: "Extract the primary bank account number"
  },
  {
    label: "Account Number Type",
    key: "accountNumber1Type",
    type: "string",
    description: "One of iban, clabe, wallet_address, hk_number, nz_number or other. Use other if the bank account number is in a generic format. For international payments, use iban",
    geminiPromptHint: "Determine the type of the primary account number (e.g. iban, clabe, other)"
  },
  {
    label: "Account Number 2",
    key: "accountNumber2",
    type: "string",
    description: "If necessary, a additional account number",
    geminiPromptHint: "Extract any secondary account number if present"
  },
  {
    label: "Account Number 2 Type",
    key: "accountNumber2Type",
    type: "string",
    description: "The type of the the additional account number",
    geminiPromptHint: "Determine the type of the secondary account number"
  }
]

const routingNumberFields = (): SchemaProperty[] => [
  {
    label: "Routing Number",
    key: "routingNumber1",
    type: "string",
    description: "The primary routing number of the bank",
    geminiPromptHint: "Extract the primary routing number"
  },
  {
    label: "Routing Number Type",
    key: "routingNumber1Type",
    type: "string",
    description: "The type of the routing number. One of aba, swift, ca_cpa, au_bsb, gb_sort_code, in_ifsc",
    geminiPromptHint: "Determine the type of the primary routing number (e.g. aba, swift)"
  },
  {
    label: "Routing Number 2",
    key: "routingNumber2",
    type: "string",
    description: "There are some types of international bank accounts that require two routing numbers: one SWIFT code and one local routing number (e.g. au_bsb, in_ifsc, ca_cpa, etc.)",
    geminiPromptHint: "Extract any secondary routing number if applicable for international accounts"
  },
  {
    label: "Routing Number 2 Type",
    key: "routingNumber2Type",
    type: "string",
    description: "The type of the second routing number",
    geminiPromptHint: "Determine the type of the secondary routing number"
  }
]

const partyAddressFields = (): SchemaProperty[] => [
  {
    label: "Party Address Line1",
    key: "partyAddressLine1",
    type: "string",
    geminiPromptHint: "Extract the first line of the party's address"
  },
  {
    label: "Party Address Line2",
    key: "partyAddressLine2",
    type: "string",
    geminiPromptHint: "Extract the second line of the party's address if present"
  },
  {
    label: "Party Address Locality",
    key: "partyAddressLocality",
    type: "string",
    description: "The party address locality. A locality is typically a city or town",
    geminiPromptHint: "Extract the city or town from the party's address"
  },
  {
    label: "Party Address Region",
    key: "partyAddressRegion",
    type: "string",
    description: "The party address region. For US addresses, this is the state",
    geminiPromptHint: "Extract the state or region from the party's address"
  },
  {
    label: "Party Address Postal Code",
    key: "partyAddressPostalCode",
    type: "string",
    geminiPromptHint: "Extract the postal code or ZIP code from the party's address"
  },
  {
    label: "Party Address Country",
    key: "partyAddressCountry",
    type: "string",
    description: "A two-digit ISO country codes for the party address country",
    geminiPromptHint: "Extract the two-letter ISO country code from the party's address"
  }
]

const capabilityFields = (capabilityNumber: number): SchemaProperty[] => {
  const labelPrefix = `Account Capability ${capabilityNumber}`
  const keyPrefix = `capability${capabilityNumber}`

  return [
    {
      label: `${labelPrefix} Direction`,
      key: `${keyPrefix}Direction`,
      type: "string",
      description: "Must be 'credit' or 'debit'",
      geminiPromptHint: `For capability ${capabilityNumber}, determine if it supports 'credit', 'debit', or both. Default to both if not specified.`
    },
    {
      label: `${labelPrefix} Payment Type`,
      key: `${keyPrefix}PaymentType`,
      type: "string",
      geminiPromptHint: `Identify the payment type for capability ${capabilityNumber}`
    },
    {
      label: `${labelPrefix} Identifier`,
      key: `${keyPrefix}Identifier`,
      type: "string",
      description: "For ACH, this is the ACH Company ID",
      geminiPromptHint: `Extract any specific identifier for capability ${capabilityNumber}, e.g., ACH Company ID`
    },
    {
      label: `${labelPrefix} Payment Subtypes`,
      key: `${keyPrefix}PaymentSubtypes`,
      type: "string",
      description: "A comma-separated list of payment subtypes to allow. Leave blank for all subtypes",
      geminiPromptHint: `List any specific payment subtypes for capability ${capabilityNumber} (comma-separated). Leave empty for all.`
    },
    {
      label: `${labelPrefix} Any Currency`,
      key: `${keyPrefix}AnyCurrency`,
      type: "string",
      description: "When 'true', allows payments of this type for any currency",
      geminiPromptHint: `For capability ${capabilityNumber}, determine if it supports any currency ('true' or 'false').`
    },
    {
      label: `${labelPrefix} Currencies`,
      key: `${keyPrefix}Currencies`,
      type: "string",
      description: "A comma-separated list of currencies for which this type of payment can initiate",
      geminiPromptHint: `List specific currencies supported by capability ${capabilityNumber} (comma-separated ISO codes).`
    },
    {
      label: `${labelPrefix} Connection ID`,
      key: `${keyPrefix}ConnectionId`,
      type: "string",
      geminiPromptHint: `Identify any associated connection ID for capability ${capabilityNumber}`
    },
    {
      label: `${labelPrefix} Party Name`,
      key: `${keyPrefix}PartyName`,
      type: "string",
      description: "Overrides the legal name of the entity which owns the account when initiating payments",
      geminiPromptHint: `Extract any party name override for capability ${capabilityNumber}`
    },
    {
      label: `${labelPrefix} Address Line 1`,
      key: `${keyPrefix}AddressLine1`,
      type: "string",
      geminiPromptHint: `Extract Address Line 1 for capability ${capabilityNumber}`
    },
    {
      label: `${labelPrefix} Address Line 2`,
      key: `${keyPrefix}AddressLine2`,
      type: "string",
      geminiPromptHint: `Extract Address Line 2 for capability ${capabilityNumber}`
    },
    {
      label: `${labelPrefix} Address Locality`,
      key: `${keyPrefix}AddressLocality`,
      type: "string",
      description: "The address locality. A locality is typically a city or town",
      geminiPromptHint: `Extract Address Locality for capability ${capabilityNumber}`
    },
    {
      label: `${labelPrefix} Address Region`,
      key: `${keyPrefix}AddressRegion`,
      type: "string",
      description: "The address region. For US addresses, this is the state",
      geminiPromptHint: `Extract