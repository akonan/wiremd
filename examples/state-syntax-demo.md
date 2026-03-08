# Component States Demo

This example demonstrates inline state syntax and state blocks.

## Inline States

[Default]
[Hover]{:hover}
[Active]{:active}
[Focus]{:focus}
[Disabled]{:disabled}
[Loading]{:loading}
[Error]{:error}
[Success]{:success}
[Warning]{:warning}

## State Block: Disabled Form

::: state=disabled
Name
[_____________________________]

Email
[_____________________________]{type:email}

[Save Changes] [Cancel]
:::

## State Block: Error Review

::: state=error
## Validation Errors

Email
[invalid-email___________]{type:email}

Password
[***]{type:password}

[Retry]{:active}
:::

