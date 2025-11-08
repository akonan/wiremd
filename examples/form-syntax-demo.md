# Correct Form Syntax

## ✅ Correct: Label directly above input (no blank line)
Username
[_____________________________]

Email Address
[_____________________________] {type:email}

Password  
[********] {type:password}

## ✅ Short inputs work too
Age
[__]

Zip Code
[_____]

## ✅ Multiple fields in sequence
First Name
[_____________________________]
Last Name
[_____________________________]
Phone Number
[_____________________________] {type:tel}

## ✅ Textarea with label
Your Comments
[Write your feedback here...] {rows:4}

## ✅ Dropdown with label  
Select Department
[Choose one...v]
- Engineering
- Marketing
- Sales
- Support

## ❌ This won't work (blank line between label and input)
This label won't be associated

[_____________________________]

## ✅ Inline form (buttons on same line)
[Submit] [Reset] [Cancel]

## ✅ You can also use placeholders inside
[Enter your username___________]
[Enter email___________] {type:email}
