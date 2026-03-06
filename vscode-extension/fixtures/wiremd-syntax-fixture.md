# Wiremd Syntax Fixture

[Primary Action]*
[Secondary Action]{.secondary}
[Email_________________________]{type:email required}
[*****************************]{type:password}

[Documentation](https://example.com)

[[ :logo: Brand | Home | Products | [Sign In] | [Get Started]* ]]{.nav}

::: hero {.landing state:active}
## Welcome {.grid-2}
[Get Started]{.primary}
:::

::: card {.elevated}
### Contact Form
Name
[_____________________________]{required}
Email
[_____________________________]{type:email required}
Message
[Message...]{rows:5}
:::

::: unknown-type
This should produce a warning diagnostic.
:::
