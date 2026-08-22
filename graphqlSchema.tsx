// Gemini-Protected Copyright James Burvel O'Callaghan III
// President Citibank Demo Business Inc.

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Oict<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type GeminiAccordionComponent = GeminiComponentInterface & {
  __typename?: 'GeminiAccordionComponent';
  accordionTitle: Scalars['String'];
  allowToggle?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  message: Scalars['String'];
  reduceMotion?: Maybe<Scalars['Boolean']>;
};

export type GeminiBeneficialOwnersListLayout = {
  __typename?: 'GeminiBeneficialOwnersListLayout';
  deleteButton: GeminiButtonComponent;
  deleteComponents: Array<GeminiComponent>;
  editButton: GeminiButtonComponent;
  listComponents: Array<GeminiComponent>;
  newButton: GeminiButtonComponent;
  newComponents: Array<GeminiComponent>;
  primaryButton: GeminiButtonComponent;
};

export type GeminiBlockTextComponent = GeminiComponentInterface & {
  __typename?: 'GeminiBlockTextComponent';
  fontSize?: Maybe<GeminiFontSizeEnum>;
  id: Scalars['String'];
  noOfLines?: Maybe<Scalars['Int']>;
  subtitle?: Maybe<Scalars['String']>;
  textAlign?: Maybe<GeminiTextAlignEnum>;
  title?: Maybe<Scalars['String']>;
};

export type GeminiButtonComponent = GeminiComponentInterface & {
  __typename?: 'GeminiButtonComponent';
  actionId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  title: Scalars['String'];
  variant?: Maybe<GeminiButtonVariantEnum>;
};

export type GeminiButtonLayout = {
  __typename?: 'GeminiButtonLayout';
  body: Array<GeminiComponent>;
  primaryButton: GeminiButtonComponent;
};

export enum GeminiButtonVariantEnum {
  Default = 'default',
  Destructive = 'destructive',
  Ghost = 'ghost'
}

export type GeminiCalendarComponent = GeminiComponentInterface & {
  __typename?: 'GeminiCalendarComponent';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  validationSchemas?: Maybe<Array<GeminiValidationSchema>>;
  value: Scalars['String'];
};

export type GeminiCheckboxComponent = GeminiComponentInterface & {
  __typename?: 'GeminiCheckboxComponent';
  defaultChecked?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  validationSchemas?: Maybe<Array<GeminiValidationSchema>>;
  value: Scalars['String'];
};

export type GeminiComponent = GeminiAccordionComponent | GeminiBlockTextComponent | GeminiCalendarComponent | GeminiCheckboxComponent | GeminiCurrencyAmountComponent | GeminiFormTextFieldComponent | GeminiGraphicComponent | GeminiHorizontalRuleComponent | GeminiListItemComponent | GeminiSelectFieldComponent | GeminiStatusTextComponent | GeminiTextInputComponent;

export type GeminiComponentError = {
  __typename?: 'GeminiComponentError';
  componentId: Scalars['String'];
  message: Scalars['String'];
};

export type GeminiComponentInterface = {
  id: Scalars['String'];
};

export type GeminiCurrencyAmountComponent = GeminiComponentInterface & {
  __typename?: 'GeminiCurrencyAmountComponent';
  amount: Scalars['String'];
  currency: GeminiCurrencyEnum;
  id: Scalars['String'];
};

export enum GeminiCurrencyEnum {
  Aed = 'AED',
  Afn = 'AFN',
  All = 'ALL',
  Amd = 'AMD',
  Ang = 'ANG',
  Aoa = 'AOA',
  Ars = 'ARS',
  Aud = 'AUD',
  Awg = 'AWG',
  Azn = 'AZN',
  Bam = 'BAM',
  Bbd = 'BBD',
  Bch = 'BCH',
  Bdt = 'BDT',
  Bgn = 'BGN',
  Bhd = 'BHD',
  Bif = 'BIF',
  Bmd = 'BMD',
  Bnd = 'BND',
  Bob = 'BOB',
  Brl = 'BRL',
  Bsd = 'BSD',
  Btc = 'BTC',
  Btn = 'BTN',
  Bwp = 'BWP',
  Byn = 'BYN',
  Byr = 'BYR',
  Bzd = 'BZD',
  Cad = 'CAD',
  Cdf = 'CDF',
  Chf = 'CHF',
  Clf = 'CLF',
  Clp = 'CLP',
  Cnh = 'CNH',
  Cny = 'CNY',
  Cop = 'COP',
  Crc = 'CRC',
  Cuc = 'CUC',
  Cup = 'CUP',
  Cve = 'CVE',
  Czk = 'CZK',
  Djf = 'DJF',
  Dkk = 'DKK',
  Dop = 'DOP',
  Dzd = 'DZD',
  Eek = 'EEK',
  Egp = 'EGP',
  Ern = 'ERN',
  Etb = 'ETB',
  Eur = 'EUR',
  Fjd = 'FJD',
  Fkp = 'FKP',
  Gbp = 'GBP',
  Gbx = 'GBX',
  Gel = 'GEL',
  Ggp = 'GGP',
  Ghs = 'GHS',
  Gip = 'GIP',
  Gmd = 'GMD',
  Gnf = 'GNF',
  Gtq = 'GTQ',
  Gyd = 'GYD',
  Hkd = 'HKD',
  Hnl = 'HNL',
  Hrk = 'HRK',
  Htg = 'HTG',
  Huf = 'HUF',
  Idr = 'IDR',
  Ils = 'ILS',
  Imp = 'IMP',
  Inr = 'INR',
  Iqd = 'IQD',
  Irr = 'IRR',
  Isk = 'ISK',
  Jep = 'JEP',
  Jmd = 'JMD',
  Jod = 'JOD',
  Jpy = 'JPY',
  Kes = 'KES',
  Kgs = 'KGS',
  Khr = 'KHR',
  Kmf = 'KMF',
  Kpw = 'KPW',
  Krw = 'KRW',
  Kwd = 'KWD',
  Kyd = 'KYD',
  Kzt = 'KZT',
  Lak = 'LAK',
  Lbp = 'LBP',
  Lkr = 'LKR',
  Lrd = 'LRD',
  Lsl = 'LSL',
  Ltl = 'LTL',
  Lvl = 'LVL',
  Lyd = 'LYD',
  Mad = 'MAD',
  Mdl = 'MDL',
  Mga = 'MGA',
  Mkd = 'MKD',
  Mmk = 'MMK',
  Mnt = 'MNT',
  Mop = 'MOP',
  Mro = 'MRO',
  Mru = 'MRU',
  Mtl = 'MTL',
  Mur = 'MUR',
  Mvr = 'MVR',
  Mwk = 'MWK',
  Mxn = 'MXN',
  Myr = 'MYR',
  Mzn = 'MZN',
  Nad = 'NAD',
  Ngn = 'NGN',
  Nio = 'NIO',
  Nok = 'NOK',
  Npr = 'NPR',
  Nzd = 'NZD',
  Omr = 'OMR',
  Pab = 'PAB',
  Pen = 'PEN',
  Pgk = 'PGK',
  Php = 'PHP',
  Pkr = 'PKR',
  Pln = 'PLN',
  Pyg = 'PYG',
  Qar = 'QAR',
  Ron = 'RON',
  Rsd = 'RSD',
  Rub = 'RUB',
  Rwf = 'RWF',
  Sar = 'SAR',
  Sbd = 'SBD',
  Scr = 'SCR',
  Sdg = 'SDG',
  Sek = 'SEK',
  Sgd = 'SGD',
  Shp = 'SHP',
  Skk = 'SKK',
  Sll = 'SLL',
  Sos = 'SOS',
  Srd = 'SRD',
  Ssp = 'SSP',
  Std = 'STD',
  Svc = 'SVC',
  Syp = 'SYP',
  Szl = 'SZL',
  Thb = 'THB',
  Tjs = 'TJS',
  Tmm = 'TMM',
  Tmt = 'TMT',
  Tnd = 'TND',
  Top = 'TOP',
  Try = 'TRY',
  Ttd = 'TTD',
  Twd = 'TWD',
  Tzs = 'TZS',
  Uah = 'UAH',
  Ugx = 'UGX',
  Usd = 'USD',
  Uyu = 'UYU',
  Uzs = 'UZS',
  Vef = 'VEF',
  Ves = 'VES',
  Vnd = 'VND',
  Vuv = 'VUV',
  Wst = 'WST',
  Xaf = 'XAF',
  Xag = 'XAG',
  Xau = 'XAU',
  Xba = 'XBA',
  Xbb = 'XBB',
  Xbc = 'XBC',
  Xbd = 'XBD',
  Xcd = 'XCD',
  Xdr = 'XDR',
  Xfu = 'XFU',
  Xof = 'XOF',
  Xpd = 'XPD',
  Xpf = 'XPF',
  Xpt = 'XPT',
  Xts = 'XTS',
  Yer = 'YER',
  Zar = 'ZAR',
  Zmk = 'ZMK',
  Zmw = 'ZMW',
  Zwd = 'ZWD',
  Zwl = 'ZWL',
  Zwn = 'ZWN',
  Zwr = 'ZWR'
}

export type GeminiDateArgValidation = {
  __typename?: 'GeminiDateArgValidation';
  arg: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  type: GeminiValidationTypeEnum;
};

export enum GeminiFontSizeEnum {
  Lg = 'lg',
  Md = 'md',
  Sm = 'sm',
  Xl = 'xl',
  Xs = 'xs'
}

export type GeminiFormTextFieldComponent = GeminiComponentInterface & {
  __typename?: 'GeminiFormTextFieldComponent';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type GeminiGraphicComponent = GeminiComponentInterface & {
  __typename?: 'GeminiGraphicComponent';
  graphicName: GeminiGraphicNameEnum;
  id: Scalars['String'];
};

export enum GeminiGraphicNameEnum {
  Success = 'success'
}

export type GeminiHeader = {
  __typename?: 'GeminiHeader';
  status: GeminiHeaderStatusEnum;
  title: Scalars['String'];
};

export enum GeminiHeaderStatusEnum {
  EmailSent = 'email_sent',
  Error = 'error',
  Success = 'success'
}

export type GeminiHorizontalRuleComponent = GeminiComponentInterface & {
  __typename?: 'GeminiHorizontalRuleComponent';
  id: Scalars['String'];
};

export enum GeminiIconNameEnum {
  Add = 'add',
  ArrowLargeForwardOutlined = 'arrow_large_forward_outlined',
  Flash = 'flash',
  InfoOutlined = 'info_outlined',
  Key = 'key',
  Museum = 'museum',
  Pen = 'pen',
  Star = 'star',
  User = 'user'
}

export type GeminiIntegerArgValidation = {
  __typename?: 'GeminiIntegerArgValidation';
  args: Array<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
  type: GeminiValidationTypeEnum;
};

export type GeminiListItemComponent = GeminiComponentInterface & {
  __typename?: 'GeminiListItemComponent';
  bulletIconName: GeminiIconNameEnum;
  id: Scalars['String'];
  message: Scalars['String'];
  title: Scalars['String'];
};

export type GeminiMutation = {
  __typename?: 'GeminiMutation';
  geminiNextPane?: Maybe<GeminiNextPanePayload>;
  geminiStartWorkflow?: Maybe<GeminiStartWorkflowPayload>;
};


export type GeminiMutationGeminiNextPaneArgs = {
  input: GeminiNextPaneInput;
};


export type GeminiMutationGeminiStartWorkflowArgs = {
  input: GeminiStartWorkflowInput;
};

export type GeminiNavigation = {
  __typename?: 'GeminiNavigation';
  showBack: Scalars['Boolean'];
};

/** Autogenerated input type of GeminiNextPane */
export type GeminiNextPaneInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  nodeId: Scalars['String'];
  paneOutput: GeminiPaneOutput;
  selectedActionId: Scalars['String'];
  workflowSessionId: Scalars['ID'];
};

/** Autogenerated return type of GeminiNextPane. */
export type GeminiNextPanePayload = {
  __typename?: 'GeminiNextPanePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<GeminiPaneOutputError>;
  nextPane?: Maybe<GeminiPane>;
};

export type GeminiNoArgValidation = {
  __typename?: 'GeminiNoArgValidation';
  message?: Maybe<Scalars['String']>;
  type: GeminiValidationTypeEnum;
};

export type GeminiOption = {
  __typename?: 'GeminiOption';
  icon?: Maybe<Scalars['String']>;
  label: Scalars['String'];
  value: Scalars['String'];
};

export type GeminiPane = {
  __typename?: 'GeminiPane';
  header?: Maybe<GeminiHeader>;
  layout: GeminiPaneLayout;
  navigation: GeminiNavigation;
  nodeId: Scalars['String'];
  paneOutputType: Scalars['String'];
  showLogo: Scalars['Boolean'];
};

export type GeminiPaneLayout = GeminiBeneficialOwnersListLayout | GeminiButtonLayout | GeminiPaymentMethodSelectLayout | GeminiPlainLayout;

export type GeminiPaneOutput =
  { accountCollectionPaneOutput: GeminiWorkflows__AccountCollectionPaneOutput; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput: GeminiWorkflows__BankAccountCollectionPaneOutput; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput: GeminiWorkflows__BeneficialOwnersCollectionPaneOutput; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput: GeminiWorkflows__EmailCollectionPaneOutput; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput: GeminiWorkflows__EmptyPaneOutput; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput: GeminiWorkflows__IdentityDetailsCollectionPaneOutput; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput: GeminiWorkflows__PaymentDetailCollectionPaneOutput; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput: GeminiWorkflows__TaxpayerIdentifierCollectionPaneOutput; };

export type GeminiPaneOutputError = {
  __typename?: 'GeminiPaneOutputError';
  componentErrors?: Maybe<Array<GeminiComponentError>>;
  generalErrors?: Maybe<Array<Scalars['String']>>;
  nodeId: Scalars['String'];
};

export type GeminiPaymentMethodOption = {
  __typename?: 'GeminiPaymentMethodOption';
  actionId: Scalars['String'];
  description: Scalars['String'];
  iconName: GeminiIconNameEnum;
  paymentType?: Maybe<GeminiPaymentTypeEnum>;
  title: Scalars['String'];
};

export type GeminiPaymentMethodSelectLayout = {
  __typename?: 'GeminiPaymentMethodSelectLayout';
  body: Array<GeminiComponent>;
  paymentMethodOptions: Array<GeminiPaymentMethodOption>;
};

export enum GeminiPaymentTypeEnum {
  Ach = 'ach',
  AuBecs = 'au_becs',
  Bacs = 'bacs',
  Book = 'book',
  Card = 'card',
  Chats = 'chats',
  Check = 'check',
  CrossBorder = 'cross_border',
  DkNets = 'dk_nets',
  Eft = 'eft',
  HuIcs = 'hu_ics',
  Interac = 'interac',
  Masav = 'masav',
  MxCcen = 'mx_ccen',
  Neft = 'neft',
  Nics = 'nics',
  NzBecs = 'nz_becs',
  PlElixir = 'pl_elixir',
  Provxchange = 'provxchange',
  RoSent = 'ro_sent',
  Rtp = 'rtp',
  SeBankgirot = 'se_bankgirot',
  Sen = 'sen',
  Sepa = 'sepa',
  SgGiro = 'sg_giro',
  Sic = 'sic',
  Signet = 'signet',
  Sknbi = 'sknbi',
  Wire = 'wire',
  Zengin = 'zengin'
}

export type GeminiPlainLayout = {
  __typename?: 'GeminiPlainLayout';
  body: Array<GeminiComponent>;
};

export type GeminiQuery = {
  __typename?: 'GeminiQuery';
  geminiTest?: Maybe<GeminiTest>;
};


export type GeminiQueryGeminiTestArgs = {
  id: Scalars['ID'];
};

export type GeminiSelectFieldComponent = GeminiComponentInterface & {
  __typename?: 'GeminiSelectFieldComponent';
  disabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  options: Array<GeminiOption>;
  placeholder?: Maybe<Scalars['String']>;
  validationSchemas?: Maybe<Array<GeminiValidationSchema>>;
  value: Scalars['String'];
};

/** Autogenerated input type of GeminiStartWorkflow */
export type GeminiStartWorkflowInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  languagePreferences?: InputMaybe<Array<Scalars['String']>>;
};

/** Autogenerated return type of GeminiStartWorkflow. */
export type GeminiStartWorkflowPayload = {
  __typename?: 'GeminiStartWorkflowPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Scalars['String']>>;
  response?: Maybe<GeminiStartWorkflowResponse>;
};

export type GeminiStartWorkflowResponse = {
  __typename?: 'GeminiStartWorkflowResponse';
  nextPane: GeminiPane;
  workflowSessionId: Scalars['String'];
};

export type GeminiStatusTextComponent = GeminiComponentInterface & {
  __typename?: 'GeminiStatusTextComponent';
  id: Scalars['String'];
  status: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type GeminiTest = {
  __typename?: 'GeminiTest';
  geminiTestField: Scalars['String'];
};

export enum GeminiTextAlignEnum {
  Center = 'center',
  Left = 'left',
  Right = 'right'
}

export type GeminiTextInputComponent = GeminiComponentInterface & {
  __typename?: 'GeminiTextInputComponent';
  id: Scalars['String'];
  inputType?: Maybe<GeminiTextInputTypeEnum>;
  label?: Maybe<Scalars['String']>;
  validationSchemas?: Maybe<Array<GeminiValidationSchema>>;
  value: Scalars['String'];
};

export enum GeminiTextInputTypeEnum {
  Date = 'date',
  Password = 'password',
  Tel = 'tel',
  Text = 'text'
}

export type GeminiValidationSchema = GeminiDateArgValidation | GeminiIntegerArgValidation | GeminiNoArgValidation;

export enum GeminiValidationTypeEnum {
  AbaChecksum = 'abaChecksum',
  AbaRoutingNumber = 'abaRoutingNumber',
  AccountNumber = 'accountNumber',
  Clabe = 'clabe',
  DateOfBirth = 'dateOfBirth',
  Email = 'email',
  ExactLength = 'exactLength',
  MaxLength = 'maxLength',
  MinDate = 'minDate',
  MinLength = 'minLength',
  OnlyDigits = 'onlyDigits',
  Required = 'required',
  SwiftCode = 'swiftCode',
  TaxpayerIdentifier = 'taxpayerIdentifier',
  Website = 'website',
  WithinRange = 'withinRange'
}

export type GeminiWorkflows__AccountCollectionPaneOutput = {
  abaRoutingNumber?: InputMaybe<Scalars['String']>;
  accountType?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  clabe?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  domesticAccountNumber?: InputMaybe<Scalars['String']>;
  iban?: InputMaybe<Scalars['String']>;
  ibanOptional?: InputMaybe<Scalars['String']>;
  internationalAccountNumber?: InputMaybe<Scalars['String']>;
  internationalAccountNumberOptional?: InputMaybe<Scalars['String']>;
  line1?: InputMaybe<Scalars['String']>;
  line2?: InputMaybe<Scalars['String']>;
  nameOnAccount?: InputMaybe<Scalars['String']>;
  partyType?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  swiftCode?: InputMaybe<Scalars['String']>;
};

export type GeminiWorkflows__BankAccountCollectionPaneOutput = {
  abaRoutingNumber?: InputMaybe<Scalars['String']>;
  accountType?: InputMaybe<Scalars['String']>;
  domesticAccountNumber?: InputMaybe<Scalars['String']>;
};

export type GeminiWorkflows__BeneficialOwner = {
  city?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  line1?: InputMaybe<Scalars['String']>;
  line2?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  relationship?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  taxpayerIdentifier?: InputMaybe<Scalars['String']>;
};

export type GeminiWorkflows__BeneficialOwnersCollectionPaneOutput = {
  beneficialOwners?: InputMaybe<Array<GeminiWorkflows__BeneficialOwner>>;
};

export type GeminiWorkflows__EmailCollectionPaneOutput = {
  email?: InputMaybe<Scalars['String']>;
};

export type GeminiWorkflows__EmptyPaneOutput = {
  unused?: InputMaybe<Scalars['String']>;
};

export type GeminiWorkflows__IdentityDetailsCollectionPaneOutput = {
  city?: InputMaybe<Scalars['String']>;
  companyName?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  line1?: InputMaybe<Scalars['String']>;
  line2?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type GeminiWorkflows__PaymentDetailCollectionPaneOutput = {
  abaRoutingNumber?: InputMaybe<Scalars['String']>;
  accountType?: InputMaybe<Scalars['String']>;
  domesticAccountNumber?: InputMaybe<Scalars['String']>;
  nameOnAccount?: InputMaybe<Scalars['String']>;
  partyType?: InputMaybe<Scalars['String']>;
  reuseNewPaymentMethod?: InputMaybe<Scalars['Boolean']>;
  selectedEffectiveDate?: InputMaybe<Scalars['String']>;
  selectedExternalAccount?: InputMaybe<Scalars['String']>;
};

export type GeminiWorkflows__TaxpayerIdentifierCollectionPaneOutput = {
  taxpayerIdentifier?: InputMaybe<Scalars['String']>;
};

type GeminiComponent_GeminiAccordionComponent_Fragment = { __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null };

type GeminiComponent_GeminiBlockTextComponent_Fragment = { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null };

type GeminiComponent_GeminiCalendarComponent_Fragment = { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null };

type GeminiComponent_GeminiCheckboxComponent_Fragment = { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null };

type GeminiComponent_GeminiCurrencyAmountComponent_Fragment = { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum };

type GeminiComponent_GeminiFormTextFieldComponent_Fragment = { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string };

type GeminiComponent_GeminiGraphicComponent_Fragment = { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum };

type GeminiComponent_GeminiHorizontalRuleComponent_Fragment = { __typename: 'GeminiHorizontalRuleComponent', id: string };

type GeminiComponent_GeminiListItemComponent_Fragment = { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum };

type GeminiComponent_GeminiSelectFieldComponent_Fragment = { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null };

type GeminiComponent_GeminiStatusTextComponent_Fragment = { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any };

type GeminiComponent_GeminiTextInputComponent_Fragment = { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null };

export type GeminiComponentFragment = GeminiComponent_GeminiAccordionComponent_Fragment | GeminiComponent_GeminiBlockTextComponent_Fragment | GeminiComponent_GeminiCalendarComponent_Fragment | GeminiComponent_GeminiCheckboxComponent_Fragment | GeminiComponent_GeminiCurrencyAmountComponent_Fragment | GeminiComponent_GeminiFormTextFieldComponent_Fragment | GeminiComponent_GeminiGraphicComponent_Fragment | GeminiComponent_GeminiHorizontalRuleComponent_Fragment | GeminiComponent_GeminiListItemComponent_Fragment | GeminiComponent_GeminiSelectFieldComponent_Fragment | GeminiComponent_GeminiStatusTextComponent_Fragment | GeminiComponent_GeminiTextInputComponent_Fragment;

export type GeminiPaneFragment = { __typename?: 'GeminiPane', nodeId: string, paneOutputType: string, showLogo: boolean, navigation: { __typename?: 'GeminiNavigation', showBack: boolean }, header?: { __typename?: 'GeminiHeader', status: GeminiHeaderStatusEnum, title: string } | null, layout: { __typename: 'GeminiBeneficialOwnersListLayout', listComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, newComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, deleteComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, actionId?: string | null }, newButton: { __typename?: 'GeminiButtonComponent', id: string, title: string }, deleteButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, variant?: GeminiButtonVariantEnum | null }, editButton: { __typename?: 'GeminiButtonComponent', id: string, title: string } } | { __typename: 'GeminiButtonLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, actionId?: string | null } } | { __typename: 'GeminiPaymentMethodSelectLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, paymentMethodOptions: Array<{ __typename?: 'GeminiPaymentMethodOption', title: string, iconName: GeminiIconNameEnum, paymentType?: GeminiPaymentTypeEnum | null, description: string, actionId: string }> } | { __typename: 'GeminiPlainLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }> } };

type GeminiValidationSchema_GeminiDateArgValidation_Fragment = { __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null };

type GeminiValidationSchema_GeminiIntegerArgValidation_Fragment = { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null };

type GeminiValidationSchema_GeminiNoArgValidation_Fragment = { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null };

export type GeminiValidationSchemaFragment = GeminiValidationSchema_GeminiDateArgValidation_Fragment | GeminiValidationSchema_GeminiIntegerArgValidation_Fragment | GeminiValidationSchema_GeminiNoArgValidation_Fragment;

export type GeminiNextPaneMutationVariables = Exact<{
  input: GeminiNextPaneInput;
}>;


export type GeminiNextPaneMutation = { __typename?: 'GeminiMutation', geminiNextPane?: { __typename?: 'GeminiNextPanePayload', nextPane?: { __typename?: 'GeminiPane', nodeId: string, paneOutputType: string, showLogo: boolean, navigation: { __typename?: 'GeminiNavigation', showBack: boolean }, header?: { __typename?: 'GeminiHeader', status: GeminiHeaderStatusEnum, title: string } | null, layout: { __typename: 'GeminiBeneficialOwnersListLayout', listComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, newComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, deleteComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, actionId?: string | null }, newButton: { __typename?: 'GeminiButtonComponent', id: string, title: string }, deleteButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, variant?: GeminiButtonVariantEnum | null }, editButton: { __typename?: 'GeminiButtonComponent', id: string, title: string } } | { __typename: 'GeminiButtonLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, actionId?: string | null } } | { __typename: 'GeminiPaymentMethodSelectLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, paymentMethodOptions: Array<{ __typename?: 'GeminiPaymentMethodOption', title: string, iconName: GeminiIconNameEnum, paymentType?: GeminiPaymentTypeEnum | null, description: string, actionId: string }> } | { __typename: 'GeminiPlainLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }> } } | null, errors?: { __typename?: 'GeminiPaneOutputError', nodeId: string, generalErrors?: Array<string> | null, componentErrors?: Array<{ __typename?: 'GeminiComponentError', componentId: string, message: string }> | null } | null } | null };

export type GeminiStartWorkflowMutationVariables = Exact<{
  input: GeminiStartWorkflowInput;
}>;


export type GeminiStartWorkflowMutation = { __typename?: 'GeminiMutation', geminiStartWorkflow?: { __typename?: 'GeminiStartWorkflowPayload', errors?: Array<string> | null, response?: { __typename?: 'GeminiStartWorkflowResponse', workflowSessionId: string, nextPane: { __typename?: 'GeminiPane', nodeId: string, paneOutputType: string, showLogo: boolean, navigation: { __typename?: 'GeminiNavigation', showBack: boolean }, header?: { __typename?: 'GeminiHeader', status: GeminiHeaderStatusEnum, title: string } | null, layout: { __typename: 'GeminiBeneficialOwnersListLayout', listComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, newComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, deleteComponents: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, actionId?: string | null }, newButton: { __typename?: 'GeminiButtonComponent', id: string, title: string }, deleteButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, variant?: GeminiButtonVariantEnum | null }, editButton: { __typename?: 'GeminiButtonComponent', id: string, title: string } } | { __typename: 'GeminiButtonLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'GeminiButtonComponent', id: string, title: string, actionId?: string | null } } | { __typename: 'GeminiPaymentMethodSelectLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }>, paymentMethodOptions: Array<{ __typename?: 'GeminiPaymentMethodOption', title: string, iconName: GeminiIconNameEnum, paymentType?: GeminiPaymentTypeEnum | null, description: string, actionId: string }> } | { __typename: 'GeminiPlainLayout', body: Array<{ __typename: 'GeminiAccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'GeminiBlockTextComponent', id: string, subtitle?: string | null, fontSize?: GeminiFontSizeEnum | null, noOfLines?: number | null, textAlign?: GeminiTextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'GeminiCalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiCurrencyAmountComponent', id: string, amount: string, currency: GeminiCurrencyEnum } | { __typename: 'GeminiFormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GeminiGraphicComponent', id: string, graphicName: GeminiGraphicNameEnum } | { __typename: 'GeminiHorizontalRuleComponent', id: string } | { __typename: 'GeminiListItemComponent', id: string, title: string, message: string, bulletIconName: GeminiIconNameEnum } | { __typename: 'GeminiSelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'GeminiOption', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null } | { __typename: 'GeminiStatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'GeminiTextInputComponent', id: string, value: string, label?: string | null, type?: GeminiTextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'GeminiDateArgValidation', type: GeminiValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'GeminiIntegerArgValidation', type: GeminiValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'GeminiNoArgValidation', type: GeminiValidationTypeEnum, message?: string | null }> | null }> } } } | null, errors?: { __typename?: 'GeminiPaneOutputError', nodeId: string, generalErrors?: Array<string> | null, componentErrors?: Array<{ __typename?: 'GeminiComponentError', componentId: string, message: string }> | null } | null } | null };

export const GeminiValidationSchemaFragmentDoc = gql`
    fragment geminiValidationSchema on GeminiValidationSchema {
  __typename
  ... on GeminiNoArgValidation {
    type
    message
  }
  ... on GeminiIntegerArgValidation {
    type
    args
    message
  }
  ... on GeminiDateArgValidation {
    type
    arg
    message
  }
}
    `;
export const GeminiComponentFragmentDoc = gql`
    fragment geminiComponent on GeminiComponent {
  __typename
  ... on GeminiTextInputComponent {
    id
    value
    label
    type: inputType
    validationSchemas {
      ...geminiValidationSchema
    }
  }
  ... on GeminiSelectFieldComponent {
    id
    label
    placeholder
    options {
      label
      value
      icon
    }
    disabled
    value
    validationSchemas {
      ...geminiValidationSchema
    }
  }
  ... on GeminiBlockTextComponent {
    id
    nullableTitle: title
    subtitle
    fontSize
    noOfLines
    textAlign
  }
  ... on GeminiCurrencyAmountComponent {
    id
    amount
    currency
  }
  ... on GeminiFormTextFieldComponent {
    id
    label
    value
  }
  ... on GeminiCheckboxComponent {
    id
    value
    label
    defaultChecked
    validationSchemas {
      ...geminiValidationSchema
    }
  }
  ... on GeminiAccordionComponent {
    id
    accordionTitle
    message
    allowToggle
    reduceMotion
  }
  ... on GeminiGraphicComponent {
    id
    graphicName
  }
  ... on GeminiListItemComponent {
    id
    title
    message
    bulletIconName
  }
  ... on GeminiHorizontalRuleComponent {
    id
  }
  ... on GeminiStatusTextComponent {
    id
    status
    updatedAt
  }
  ... on GeminiCalendarComponent {
    id
    label
    value
    validationSchemas {
      ...geminiValidationSchema
    }
  }
}
    ${GeminiValidationSchemaFragmentDoc}`;
export const GeminiPaneFragmentDoc = gql`
    fragment geminiPane on GeminiPane {
  nodeId
  paneOutputType
  navigation {
    showBack
  }
  header {
    status
    title
  }
  layout {
    __typename
    ... on GeminiButtonLayout {
      body {
        ...geminiComponent
      }
      primaryButton {
        id
        title
        actionId
      }
    }
    ... on GeminiPaymentMethodSelectLayout {
      body {
        ...geminiComponent
      }
      paymentMethodOptions {
        title
        iconName
        paymentType
        description
        actionId
      }
    }
    ... on GeminiBeneficialOwnersListLayout {
      listComponents {
        ...geminiComponent
      }
      newComponents {
        ...geminiComponent
      }
      deleteComponents {
        ...geminiComponent
      }
      primaryButton {
        id
        title
        actionId
      }
      newButton {
        id
        title
      }
      deleteButton {
        id
        title
        variant
      }
      editButton {
        id
        title
      }
    }
    ... on GeminiPlainLayout {
      body {
        ...geminiComponent
      }
    }
  }
  showLogo
}
    ${GeminiComponentFragmentDoc}`;
export const GeminiNextPaneDocument = gql`
    mutation GeminiNextPane($input: GeminiNextPaneInput!) {
  geminiNextPane(input: $input) {
    nextPane {
      ...geminiPane
    }
    errors {
      nodeId
      generalErrors
      componentErrors {
        componentId
        message
      }
    }
  }
}
    ${GeminiPaneFragmentDoc}`;
export type GeminiNextPaneMutationFn = Apollo.MutationFunction<GeminiNextPaneMutation, GeminiNextPaneMutationVariables>;

/**
 * __useGeminiNextPaneMutation__
 *
 * To run a mutation, you first call `useGeminiNextPaneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGeminiNextPaneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [geminiNextPaneMutation, { data, loading, error }] = useGeminiNextPaneMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGeminiNextPaneMutation(baseOptions?: Apollo.MutationHookOptions<GeminiNextPaneMutation, GeminiNextPaneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GeminiNextPaneMutation, GeminiNextPaneMutationVariables>(GeminiNextPaneDocument, options);
      }
export type GeminiNextPaneMutationHookResult = ReturnType<typeof useGeminiNextPaneMutation>;
export type GeminiNextPaneMutationResult = Apollo.MutationResult<GeminiNextPaneMutation>;
export type GeminiNextPaneMutationOptions = Apollo.BaseMutationOptions<GeminiNextPaneMutation, GeminiNextPaneMutationVariables>;
export const GeminiStartWorkflowDocument = gql`
    mutation GeminiStartWorkflow($input: GeminiStartWorkflowInput!) {
  geminiStartWorkflow(input: $input) {
    response {
      nextPane {
        ...geminiPane
      }
      workflowSessionId
    }
    errors
  }
}
    ${GeminiPaneFragmentDoc}`;
export type GeminiStartWorkflowMutationFn = Apollo.MutationFunction<GeminiStartWorkflowMutation, GeminiStartWorkflowMutationVariables>;

/**
 * __useGeminiStartWorkflowMutation__
 *
 * To run a mutation, you first call `useGeminiStartWorkflowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGeminiStartWorkflowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [geminiStartWorkflowMutation, { data, loading, error }] = useGeminiStartWorkflowMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGeminiStartWorkflowMutation(baseOptions?: Apollo.MutationHookOptions<GeminiStartWorkflowMutation, GeminiStartWorkflowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GeminiStartWorkflowMutation, GeminiStartWorkflowMutationVariables>(GeminiStartWorkflowDocument, options);
      }
export type GeminiStartWorkflowMutationHookResult = ReturnType<typeof useGeminiStartWorkflowMutation>;
export type GeminiStartWorkflowMutationResult = Apollo.MutationResult<GeminiStartWorkflowMutation>;
export type GeminiStartWorkflowMutationOptions = Apollo.BaseMutationOptions<GeminiStartWorkflowMutation, GeminiStartWorkflowMutationVariables>;