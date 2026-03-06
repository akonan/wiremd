export const WIREMD_CONTAINER_TYPES = [
  'hero',
  'card',
  'modal',
  'sidebar',
  'footer',
  'alert',
  'grid',
  'layout',
  'section',
  'form-group',
  'button-group'
] as const;

export const WIREMD_INPUT_TYPES = [
  'text',
  'email',
  'password',
  'tel',
  'url',
  'number',
  'date',
  'time',
  'datetime-local',
  'search'
] as const;

export const WIREMD_STATE_VALUES = [
  'disabled',
  'loading',
  'active',
  'error',
  'success',
  'warning'
] as const;

export const WIREMD_ATTRIBUTE_KEYS = [
  'type',
  'placeholder',
  'required',
  'disabled',
  'value',
  'pattern',
  'min',
  'max',
  'step',
  'rows',
  'cols',
  'state'
] as const;

export const WIREMD_CLASS_SUGGESTIONS = [
  '.primary',
  '.secondary',
  '.danger',
  '.outline',
  '.grid-2',
  '.grid-3',
  '.grid-4',
  '.grid-auto',
  '.sidebar',
  '.main'
] as const;

export type WiremdSnippet = {
  label: string;
  detail: string;
  insertText: string;
};

export const WIREMD_SNIPPETS: readonly WiremdSnippet[] = [
  {
    label: 'wiremd.hero',
    detail: 'Hero container block',
    insertText: '::: hero\\n# ${1:Heading}\\n${2:Description}\\n[${3:Get Started}]{.primary}\\n:::'
  },
  {
    label: 'wiremd.card',
    detail: 'Card container block',
    insertText: '::: card\\n### ${1:Title}\\n${2:Body text}\\n[${3:Action}]\\n:::'
  },
  {
    label: 'wiremd.alert',
    detail: 'Alert container block',
    insertText: '::: alert ${1|success,info,warning,error|}\\n${2:Message}\\n:::'
  },
  {
    label: 'wiremd.form',
    detail: 'Form pattern with labeled fields',
    insertText: '## ${1:Contact Form}\\n\\n${2:Name}\\n[_____________________________]{required}\\n\\n${3:Email}\\n[_____________________________]{type:email required}\\n\\n[${4:Submit}]* [${5:Cancel}]'
  },
  {
    label: 'wiremd.nav.inline',
    detail: 'Inline navigation container',
    insertText: '[[ ${1::logo: Brand} | ${2:Home} | ${3:Products} | [${4:Sign In}] ]]{.nav}'
  }
] as const;

export const WIREMD_HOVER_DOCS: Record<string, string> = {
  button: 'Button syntax: `[Text]` or `[Text]{.primary}`. A trailing `*` marks primary.',
  input: 'Input syntax: `[___]` with optional attributes, e.g. `{type:email required}`.',
  inlineContainer: 'Inline container syntax: `[[ item | item | item ]]` for nav or grouped inline content.',
  container: 'Block container syntax: `::: type ... :::` where `type` is a known container type.',
  attributes: 'Attributes syntax: `{.class key:value required}`. Classes use `.`, booleans omit values.',
  type: 'Input type attribute values include `text`, `email`, `password`, `tel`, `url`, `number`, `date`, `time`, `datetime-local`, `search`.'
};
