# RAG KNOWLEDGE BASE — Close Issue Guide 1.4

Each CASE is an independent retrieval unit focused on tester action. Retrieve the case using Resolve option (Medium) and Resolve Option (Small), then instruct the tester to follow the exact Tester Approach and Close option. Do not invent or change the defined action or Close option.

## CASE ID: CIG-001

- **Resolve option (Medium):** `Issue Fixed (Except Source changes)`
- **Resolve Option (Small):** `Resource Issue(replace/fix)`
- **Developer Thinking:** Improve to revise other Resource, don't improve to (image and Audio etc., don't bring CL from P4)
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Resource Issue(replace/fix), Issue Fixed (Except Source changes), Fixed, resource, replace resource, fix resource, image, audio, asset, resource revision, Improve, revise, other, Resource, don, image, and, Audio

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"


## CASE ID: CIG-002

- **Resolve option (Medium):** `Issue Fixed (Except Source changes)`
- **Resolve Option (Small):** `Mechanical Issue`
- **Developer Thinking:** When there was a physical problem on device, like some button doesn't work properly
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Mechanical Issue, Issue Fixed (Except Source changes), Fixed, mechanical, physical problem, physical issue, button problem, button not working, mechanics, device hardware, physical, device, button, doesn, work, properly

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-003

- **Resolve option (Medium):** `Issue Fixed (Except Source changes)`
- **Resolve Option (Small):** `H/W Issue`
- **Developer Thinking:** When issue is not related to software, but hardware.
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

H/W Issue, Issue Fixed (Except Source changes), Fixed, hardware, HW, hardware issue, non software, device hardware, component problem, software, but, hardware.

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-004

- **Resolve option (Medium):** `Issue Fixed (Except Source changes)`
- **Resolve Option (Small):** `Reflect design changes`
- **Developer Thinking:** Issue solved. No code changes was applied
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Reflect design changes, Issue Fixed (Except Source changes), Fixed, design change, no code change, design reflected, issue solved, solved., code, changes, applied

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-005

- **Resolve option (Medium):** `Issue Fixed (Except Source changes)`
- **Resolve Option (Small):** `Process PGM error correction`
- **Developer Thinking:** Issue solved. No code changes was applied
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Process PGM error correction, Issue Fixed (Except Source changes), Fixed, process PGM, program error correction, no code change, process correction, solved., code, changes, applied

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-006

- **Resolve option (Medium):** `Issue Fixed (Except Source changes)`
- **Resolve Option (Small):** `Server Issue`
- **Developer Thinking:** Operation issue of Server, Service (Not device S/W Issue)
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Server Issue, Issue Fixed (Except Source changes), Fixed, server, service, backend, service operation, server problem, not device software, Operation, Server, Service, device, S/W

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-007

- **Resolve option (Medium):** `Issue Fixed (Source changes)`
- **Resolve Option (Small):** `Adding implementation`
- **Developer Thinking:** When the planned function/performance was released unimplemented.
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Adding implementation, Issue Fixed (Source changes), Fixed, missing implementation, unimplemented feature, planned function missing, planned performance missing, the, planned, function/performance, released, unimplemented.

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-008

- **Resolve option (Medium):** `Issue Fixed (Source changes)`
- **Resolve Option (Small):** `Fixing error`
- **Developer Thinking:** When there was a problem with the basic operation, at which the planned function/performance was implemented.
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Fixing error, Issue Fixed (Source changes), Fixed, software error, basic operation problem, implemented feature defect, source fix, the, basic, operation, planned, function/performance, implemented.

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-009

- **Resolve option (Medium):** `Issue Fixed (Source changes)`
- **Resolve Option (Small):** `Adding/Fixing exception-handling`
- **Developer Thinking:** When there was a problem due to insufficient exceptional handling, at which the planned function/performance was implemented.
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Adding/Fixing exception-handling, Issue Fixed (Source changes), Fixed, exception handling, exceptional case, edge case, insufficient exception handling, due, insufficient, exceptional, handling, the, planned, function/performance, implemented.

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-010

- **Resolve option (Medium):** `Issue Fixed (Source changes)`
- **Resolve Option (Small):** `Implementing due to changing/adding/deleting requirements`
- **Developer Thinking:** When SW was modified due to changing/adding/deleting specifications(requested by Carrier provider, UI/UX, OS, PRD/Feature-Set, modification of performance target, etc.).
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Implementing due to changing/adding/deleting requirements, Issue Fixed (Source changes), Fixed, requirement change, specification change, carrier requirement, UI UX, OS requirement, PRD, feature set, modified, due, changing/adding/deleting, specifications, requested, Carrier, provider, UI/UX

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-011

- **Resolve option (Medium):** `Issue Fixed (Source changes)`
- **Resolve Option (Small):** `Implementing for workaround`
- **Developer Thinking:** When SW was modified for a problem that is not caused by SW. (by HW, Mechanics, field specific condition, etc.)
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Implementing for workaround, Issue Fixed (Source changes), Fixed, workaround, non software cause, hardware cause, mechanics, field condition, modified, for, caused, SW., Mechanics, field, condition, etc.

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-012

- **Resolve option (Medium):** `Issue Fixed (Source changes)`
- **Resolve Option (Small):** `Fixed (Fixed automatically by Main branch)`
- **Developer Thinking:** Don't need to additional solution because main branch reflect solution
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Fixed (Fixed automatically by Main branch), Issue Fixed (Source changes), Fixed, main branch, automatically fixed, main branch solution, auto fix, Don, need, additional, solution, main, branch, reflect

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-013

- **Resolve option (Medium):** `Issue Fixed (Source changes)`
- **Resolve Option (Small):** `Pre-load (except. Stub)`
- **Developer Thinking:** When the issue is related to preloaded app
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Pre-load (except. Stub), Issue Fixed (Source changes), Fixed, preload, preloaded app, pre-load app, bundled app, the, preloaded, app

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-014

- **Resolve option (Medium):** `Issue Fixed (Source changes)`
- **Resolve Option (Small):** `Blank`
- **Developer Thinking:** N/A
- **Modification rate:** `Good`

### Tester Approach

Action: 

For issue status `Resolve - Released` check if the issue is fixed on binary indicated in `Resolution S/W Ver.`:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment on issue informing that is not fixed attaching new log and video as evidence.

For issue status `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

### Close option

`Fixed`

### Keywords

Blank, Issue Fixed (Source changes), Fixed

### Example questions and answers

1. The developer Resolve my Issue as "Issue Fixed. What action should I take as a tester, and which Close option should I use?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

2. For a Issue resolved as "Issue Fixed, what is the required Tester Approach before I close or reject the issue?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

3. I received an issue resolved as "Issue Fixed (Except Source changes)" / "Resource Issue(replace/fix)". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

If your issue status is "Resolve - Released" check if the issue is fixed on binary indicated in "Resolution S/W Ver." field:

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, reject the issue, leave a comment informing that is not fixed attaching new log and video as evidence.

   If your issue status is `Resolve - Not Released` check if there is a new binary available and check if the issue is fixed.

   - If fixed, select the their binary version on `Resolution Confirmation S/W Ver.:` and close option as `Fixed`.
   - If not fixed, leave a comment informing that is not fixed on that version, in this case you must not reject.

4. A minha issue está `Resolve - Released`, mas a release indicada pelo dev ainda não saiu. O quê eu faço?

**Answer**

Se a sua issue estiver na pasta do Backbone é possível que tenha saído para o Backbone, mas ainda não saiu para o projeto LA, comente na issue "Waiting for LA binary be released"

## CASE ID: CIG-015

- **Resolve option (Medium):** `Not reproduced`
- **Resolve Option (Small):** `N/A`
- **Developer Thinking:** Cannot reproduce
- **Modification rate:** `Neutral`

### Tester Approach

Action: Make ten-fold test with secured sample (same sample that the problem was registered).
   - If issue occurs, reopen issue attaching new evidences(Log and video).
   - If issue do not occur, close as `Not Fixed_Irreproducibility` and leave a comment attaching evidences(Log and video) in `Text History`.
       ```
      Dear all,
      Checked in release XXX
      App ver: XXX
      Checked 10 times in secured sample and the issue does not occurs. XXX evidence attached.
       ```
    close if no issue occurs and add comment in the issue.

* If you don't have secured sample simulate testing, ten-fold test with 10 sample.
* If samples are insufficient, 20-fold test with 5 samples.
     ```
      Dear all,
      Checked in release XXX
      App ver: XXX
      Checked 10 times in 10 not secured sample and the issue does not occur. XXX evidence attached. 
       ```

### Close option

`Not Fixed_Ireproducibility`

### Keywords

Not reproduced, Not Fixed_Ireproducibility, not applicable, N/A, Cannot, reproduce, secure sample

### Example questions

1. Tem um comentario padrão pro caso de irreproduzível?

**Answer**

Sim, segue o comentário abaixo:
     ```
      Dear all,
      Checked in release XXX
      App ver: XXX
      Checked 10 times in secured sample and the issue does not occurs. XXX evidence attached.
       ```


2. O quê eu devo fazer se o dev resolver minha issue como irreproduzível?

**Answer**

Tente reproduzir a issue 10 vezes na amostra em que a issue foi reportada(secured sample), se a issue não ocorrer nenhuma vez, colete evidências(log e vídeo) para anexar no campo `Test History` quando for fechar a issue. Comente conforme o padrão abaixo:
      ```
      Dear all,
      Checked in release XXX
      App ver: XXX
      Checked 10 times in secured sample and the issue does not occurs. XXX evidence attached.
      ```

Se a issue ocorrer rejeite e anexe novas evidências.

3. I received an issue resolved as "Not reproduced" / "N/A". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

For Resolve option (Medium) = "Not reproduced" and Resolve Option (Small) = "N/A", follow this Tester Approach exactly: 

Action: After ten-fold test with secured sample (same sample that the problem was registered), reject if issue occurs, close if no issue occurs and add comment in the issue. 
If you don't have secured sample simulate testing, ten-fold test with 10 sample.
If samples are insufficient, 20-fold test with 5 samples. 
Close option = "Not Fixed_Ireproducibility".


## CASE ID: CIG-016

- **Resolve option (Medium):** `Not Problem`
- **Resolve Option (Small):** `Product Requirement, UX Guide, Standard Technical Specification`
- **Developer Thinking:** Requirement made by Legal, Commercial or Functional(PL).
- **Modification rate:** `Neutral PRA Phase (Main Folder)`

### Tester Approach

Send email to check if there is VOCs, if there is VOCs, it is necessary request developer fix the issue, if there is no VOCs close the issue and coment adding email evidence in the issue. 

Action with Evidence -> - Comment clearly that we checked and agree with documentation attached. 

Action without evidence -> - Send email requesting documentation like Techinical report. - Reject if developer do not answer your email.

### Close option

`Not problem_Concept`

### Keywords

Product Requirement, UX Guide, Standard Technical Specification, Not Problem, Not problem_Concept, product requirement, UX guide, technical specification, legal requirement, commercial requirement, functional requirement, Requirement, made, Legal, Commercial, Functional

### Example questions

1. O desenvolvedor resolveu minha issue como "Product Requirement". What action should I take as a tester, and which Close option should I use?

**Answer**

Verifique se o desenvolvedor anexou documentação, caso não tenha anexado, solicite. Rejeite ou reabra a issue se o email não for respondido no período de 1 dia.

Caso o desenvolvedor responda que não existe documentação para tal comportamento, use a resposta do desenvolvedor via chat ou email como evidência.
Mande email para os responsáveis do seu time (felipe.ls e alexsandro.l) checarem se há mVOC relacionado:
Se não houver feche a issue comentando que não há mVOC relacionado anexando as evidências.
Se houver, reabra a issue comentando que há mVOC relacionado e solicite a correção da issue do desenvolvedor.

Feche com a opção - Close option = "Not problem_Concept".

2. Se o desenvolvedor responder que não tem documentação, o quê devo fazer?

**Answer**

Use a resposta do desenvolvedor como evidência que não há documentação.

Mande email para os responsáveis do seu time (felipe.ls e alexsandro.l) checarem se há mVOC relacionado:
Se não houver feche a issue comentando que não há mVOC relacionado anexando as evidências.
Se houver, reabra a issue comentando que há mVOC relacionado e solicite a correção da issue do desenvolvedor.

Feche com a opção - Close option = "Not problem_Concept".

3. Issue resolvida como "UX Guide" conta negativo para minha avaliação?

**Answer**

Se reportada na fase de PRA o modification rate será Neutro, só será negativa se reportada na fase de MR.


## CASE ID: CIG-017

- **Resolve option (Medium):** `Not Problem`
- **Resolve Option (Small):** `Intentional operation/phenomenon`
- **Developer Thinking:** When it is the intentionally designed operation or phenomenon, etc..
- **Modification rate:** `Neutral`

### Tester Approach

Send email to check if there is VOCs, if there is VOCs, it is necessary request developer fix the issue, if there is no VOCs close the issue and coment adding email evidence in the issue.

Action with Evidence -> - Comment clearly that we checked and agree with documentation attached.
Action without evidence -> - Send email requesting documentation like Techinical report. If developer answer that there is no documentation, attach dev chat or email as evidence that there is no documentation and comment with keywords the arguments and our acceptance.

### Close option

`Not problem_Concept`

### Keywords

Intentional, Intentional operation/phenomenon, Not Problem, Not problem_Concept, intentional behavior, by design, normal behavior, designed operation, expected phenomenon, the, intentionally, designed, operation, phenomenon, etc..

### Example questions

1. Minha issue foi resolvida como "Intentional", posso fechar a issue?

**Answer**

    1. Antes de fechar você deve verificar se o desenvolvedor colocou uma evidência, se ele colocou, cheque se há mVOC, não havendo pode fechar a issue.
    2. Se ele não colocou solicite.
    3. Se ele não responder seu email no período de 1 dia, reabra a issue comentando o motivo.
    4. Se ele responder que não há documentação, salve a conversa ou email com o desenvolvedor como evidência de que não há documentação, cheque se há mVOC, não havendo pode fechar a issue.

Antes de fechar comente com palavras-chaves "agree", "mVOC", que concorda com a resolução do desenvolvedor e anexe as evidências. Feche com a opção "Not problem_Concept"

2. For Medium "Not Problem" and Small "Intentional operation/phenomenon", what is the required Tester Approach before I close or reject the issue?

**Answer**

    1. Antes de fechar você deve verificar se o desenvolvedor colocou uma evidência, se ele colocou, cheque se há mVOC, não havendo pode fechar a issue.
    2. Se ele não colocou solicite.
    3. Se ele não responder seu email no período de 1 dia, reabra a issue comentando o motivo.
    4. Se ele responder que não há documentação, salve a conversa ou email com o desenvolvedor como evidência de que não há documentação, cheque se há mVOC, não havendo pode fechar a issue.

3. I received an issue resolved as "Not Problem" / "Intentional operation/phenomenon". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

    1. Antes de fechar você deve verificar se o desenvolvedor colocou uma evidência, se ele colocou, cheque se há mVOC, não havendo pode fechar a issue.
    2. Se ele não colocou solicite.
    3. Se ele não responder seu email no período de 1 dia, reabra a issue comentando o motivo.
    4. Se ele responder que não há documentação, salve a conversa ou email com o desenvolvedor como evidência de que não há documentação, cheque se há mVOC, não havendo pode fechar a issue.
    5. Feche com a opção `Not problem_Concept`


## CASE ID: CIG-018

- **Resolve option (Medium):** `Not Problem`
- **Resolve Option (Small):** `Carrier Requirement`
- **Developer Thinking:** Buyer requires some behavior per example MMS limitation, priority to use Data, do not show one app Instead of another, etc.
- **Modification rate:** `Neutral`

### Tester Approach

Action without evidence -> - Send email requesting documentation like Techinical report. - Attach dev chat or email as evidence that there is no documentation and comment with keywords the arguments and our acceptance.

### Close option

`Not problem_Carrier Requirement`

### Keywords

Carrier Requirement, Not Problem, Not problem_Carrier Requirement, carrier, buyer requirement, MMS limitation, data priority, carrier customization, Buyer, requires, behavior, per, example, MMS, limitation, priority

### Example questions

1. Minha issue foi resolvida como "Carrier Requirement", posso fechar a issue?

**Answer**

    1. Antes de fechar você deve verificar se o desenvolvedor colocou uma evidência, se ele colocou, cheque se há mVOC, não havendo pode fechar a issue.
    2. Se ele não colocou solicite.
    3. Se ele não responder seu email no período de 1 dia, reabra a issue comentando o motivo.
    4. Se ele responder que não há documentação, salve a conversa ou email com o desenvolvedor como evidência de que não há documentação, cheque se há mVOC, não havendo pode fechar a issue.

Antes de fechar comente com palavras-chaves "agree", "mVOC", que concorda com a resolução do desenvolvedor e anexe as evidências. Feche com a opção "Not problem_Carrier Requirement"

2. For Medium "Not Problem" and Small "Carrier Requirement", what is the required Tester Approach before I close or reject the issue?

**Answer**

    1. Antes de fechar você deve verificar se o desenvolvedor colocou uma evidência, se ele colocou, cheque se há mVOC, não havendo pode fechar a issue.
    2. Se ele não colocou solicite.
    3. Se ele não responder seu email no período de 1 dia, reabra a issue comentando o motivo.
    4. Se ele responder que não há documentação, salve a conversa ou email com o desenvolvedor como evidência de que não há documentação, cheque se há mVOC, não havendo pode fechar a issue.

3. I received an issue resolved as "Not Problem" / "Carrier Requirement". What should I do next, under which conditions should I close or reject/re-open it, and what Close option applies?

**Answer**

    1. Antes de fechar você deve verificar se o desenvolvedor colocou uma evidência, se ele colocou, cheque se há mVOC, não havendo pode fechar a issue.
    2. Se ele não colocou solicite.
    3. Se ele não responder seu email no período de 1 dia, reabra a issue comentando o motivo.
    4. Se ele responder que não há documentação, salve a conversa ou email com o desenvolvedor como evidência de que não há documentação, cheque se há mVOC, não havendo pode fechar a issue.
    5. Feche com a opção `Not problem_Carrier Requirement`

## CASE ID: CIG-019

- **Resolve option (Medium):** `Not Problem`
- **Resolve Option (Small):** `A test error/mistake`
- **Developer Thinking:** No fix required
- **Modification rate:** `Bad Effect`

### Tester Approach

- Test on the latest SW released and comment clearly that we checked with correct test procedure and agree, then close it.

### Close option

`Not problem_Test Error/Mistake`

### Keywords

A test error/mistake, Not Problem, Not problem_Test Error/Mistake, test error, tester mistake, wrong procedure, test mistake, no fix required, fix

### Example questions

1. Minha issue foi resolvida como "Test Error Mistake", posso fechar a issue?

**Answer**

    Teste na última versão de SW e comente com palavras-chaves que foi checado com o procedimento correto e que voc~e concorda com o dev. Feche com a opção `Not problem_Test Error/Mistake`
    

2. O dev resolveu minha issue como Test error mistake, eu não concordo com o resolve dele, o quê devo fazer?

**Answer**

    1. Peça uma segunda opnião, por exemplo do KP especialista, se o KP concorda com você então entre em contato com o desenvolvedor via chat ou email argumentando porquê você não concorda, sugira outra opção de resolve que você considere mais adequada.


## CASE ID: CIG-020

- **Resolve option (Medium):** `Maintain current status`
- **Resolve Option (Small):** `Network Issue`
- **Developer Thinking:** Network Issue
- **Modification rate:** `Neutral`

### Tester Approach

With Evidence -> Test on the latest SW released then close it. 
Without evidence -> Send email to dev requesting documentation like Techinical report. Reject if developer do not attach documentation. 

After analysis by the Planet team:
    * Must fix -> Open another issue with Planet Team evidence or not.
    * Normal operation -> Planet Team will attach doc. on comment of the previously closed issue.

### Close option

`Decided_Network Issue`

### Keywords

Network Issue, Maintain current status, Decided_Network Issue, network, connectivity, carrier network, network problem, Planet Team, Network

### Example questions

1. Minha issue foi resolvida como "Decided_Network Issue", posso fechar a issue?

**Answer**

    O desenvolvedor anexou evidência?
       * Se sim, pode fechar, o time de Planet irá analisar a issue e a evidência anexada pelo desenvolvedor e contactará você se for preciso abrir outra issue.
       * Se não, solicite a documentação do desenvolvedor, comente na issue, mande email e chat.

   Feche com a opção `Decided_Network Issue` 
    

## CASE ID: CIG-021

- **Resolve option (Medium):** `Maintain current status`
- **Resolve Option (Small):** `CS guiding`
- **Developer Thinking:** When you feedback for CS department to guide (ex. repair/exchage/explain). It used usually at 'Samsung Members' VOC.
- **Modification rate:** `Neutral`

### Tester Approach

Action with Evidence-> Test on the latest SW released then close it.
Without evidence -> Send email requesting documentation like Techinical report. 
Reject if developer do not attach documentation.

### Close option

`Decided_CS guide`

### Keywords

CS guiding, Maintain current status, Decided_CS guide, customer service, CS, Samsung Members, repair guidance, exchange guidance, explain to customer, you, feedback, for, department, guide, ex., repair/exchage/explain, used

### Example questions

1. Minha issue foi resolvida como "CS guiding", posso fechar a issue?

**Answer**

    O desenvolvedor anexou evidência?
       * Se sim, pode fechar, o time de Planet irá analisar a issue e a evidência anexada pelo desenvolvedor e contactará você se for preciso abrir outra issue.
       * Se não, solicite a documentação do desenvolvedor, comente na issue, mande email e chat.

   Feche com a opção `Decided_CS guide`

## CASE ID: CIG-022

- **Resolve option (Medium):** `Maintain current status`
- **Resolve Option (Small):** `Platform/System Limitation`
- **Developer Thinking:** HW or Framework do not support the solution, or the solution could bring a huge side effect
- **Modification rate:** `Neutral`

### Tester Approach

Check in the reference model: -> If the issue does not occur -> Reject the issue and ask for the fix. -> If the issue occur -> Test on the latest SW released then close it.

### Close option

`Decided_ Limitation`

### Keywords

Platform/System Limitation, Maintain current status, Decided_ Limitation, platform limitation, system limitation, framework limitation, hardware limitation, side effect, Framework, support, the, solution, could, bring, huge, side

### Example questions

1. Minha issue foi resolvida como "Platform/System Limitation", posso fechar a issue?

**Answer**

    Verifique se a issue ocorre no modelo de referência.
        * Se não ocorrer, rejeite a issue e solicite que seja corrigida, comente e anexe evidências mostrando que a issue não ocorre no modelo de referência.
        * Se ocorrer, teste na última versão de SW e comente que a issue também ocorre no modelo de referência e por isso será fechada.

   Feche com a opção `Decided_ Limitation`

## CASE ID: CIG-023

- **Resolve option (Medium):** `Maintain current status`
- **Resolve Option (Small):** `OS Issue`
- **Developer Thinking:** Common issue related to OS (No fix)
- **Modification rate:** `Neutral`

### Tester Approach

Action: Check in same OS version on Google Pixel model. -> If the issue does not occur -> Reject the issue and ask for the fix. -> If the issue occur -> Test on the latest SW released then close it. Send an email to QA PL and your coordinator aligning that it is a Common issue related to OS and will not be fixed. Test on the latest SW released then close it.

### Close option

`Decided_OS Issue`

### Keywords

OS Issue, Maintain current status, Decided_OS Issue, OS issue, operating system, common OS behavior, Google Pixel, OS limitation, Common, fix

### Example questions

1. Minha issue foi resolvida como "OS Issue", o quê devo fazer?

**Answer**

    Verifique se a issue ocorre na mesma versão de OS do Google Pixel.
       * Se a issue não ocorrer, rejeite e solicite a correção da issue.
       * Se ocorrer, teste na última versão de SW e feche a issue. Envie email para o QA PL e seu coordenador informando que é uma issue relacionado ao OS e que não será corrigida.

   Feche com a opção `Decided_OS Issue`


## CASE ID: CIG-024

- **Resolve option (Medium):** `Maintain current status`
- **Resolve Option (Small):** `Transfer of next project`
- **Developer Thinking:** Fix will be applied on next OS
- **Modification rate:** `Neutral`

### Tester Approach

A new issue will be created automatically on New OS folder or in Draft until the be created.

### Close option

`Decided_Next Project resolve`

### Keywords

Transfer of next project, Maintain current status, Decided_Next Project resolve, next project, next OS, future OS, transfer issue, Fix, applied, next

### Example questions

1. Minha issue foi resolvida como "Transfer of next project", o quê devo fazer?

**Answer**

    O desenvolvedor resolveu dessa forma, pois sua issue só será corrigida no próximo OS upgrade.
    Feche a issue, um draft será aberto na pasta de Next OS, registre a issue.

   Feche com a opção `Decided_Next Project resolve`

## CASE ID: CIG-025

- **Resolve option (Medium):** `Maintain current status`
- **Resolve Option (Small):** `Yield confirmation completed`
- **Developer Thinking:** Issue from Big Data or mVOCs where is very hard to reproduce and will continues under monitoring.
- **Modification rate:** `Neutral`

### Tester Approach

Action: The issue will be under monitoring

### Close option

`Decided_Yield confirmation or Not Fixed_Monitoring/Key management guide`

### Keywords

Yield confirmation completed, Maintain current status, Decided_Yield confirmation or Not Fixed_Monitoring/Key management guide, yield, monitoring, Big Data, mVOC, hard to reproduce, key management, Big, Data, mVOCs, very, hard, reproduce, and, continues

### Example questions

1. The developer selected Resolve option (Medium) = "Maintain current status" and Resolve Option (Small) = "Yield confirmation completed". What action should I take as a tester, and which Close option should I use?

**Answer**

    For Resolve option (Medium) = "Maintain current status" and Resolve Option (Small) = "Yield confirmation completed", follow this Tester Approach exactly: Action: The issue will be under monitoring Close option = "Decided_Yield confirmation or Not Fixed_Monitoring/Key management guide".


## CASE ID: CIG-026

- **Resolve option (Medium):** `Request to 3rd party (Non Samsung Issue)`
- **Resolve Option (Small):** `Download App (include. Stub)`
- **Developer Thinking:** Fix will be provided by 3rd party
- **Modification rate:** `Neutral`

### Tester Approach

Common process: Google, buyers customization or social applications (WhatsApp, Facebook etc.) Request 3rd_party Team process: When there is a prediction by the 3rd company of which version the issue will be fixed. When the bug review is done and the issue is already fixed in the latest version of the 3rd apk Google(GMS) or others apps as Facebook, WhatsApp, etc. Action: 3rd party Issues Resolved and with GMS/others non Samsung => Action: Close right away with the latest version and Add comment. Without ticket Reject after 1 day email. Recomended to check behavior in other models.

### Close option

`Request to 3rd party`

### Keywords

Download App (include. Stub), Request to 3rd party (Non Samsung Issue), Request to 3rd party, download app, stub, third party, partner app, Google, META, Microsoft, Fix, provided, 3rd, party

### Example questions

1. O desenvolvedor resolveu minha issue como "3rd party". Que ação devo tomar como testador, e qual close option devo usar?

**Answer**

    A issue que você reportou é de aplicativo Google ou META?
       * Se sim, o desenvolvedor deve colocar o ticket comprovando que ele reportou a issue para o app parceiro. Se ele não colocar o ticket solicite, só feche a issue se tiver o ticket.
       * Se não, feche a issue com a opção `Request to 3rd party`, após fechada clique no botão "Copy to other models" para abrir a issue na pasta "[3rd Party]3rd Party App Issue Management_Critical Issue", se for prioridade A, ou na pasta "[3rd Party]3rd Party App Issue Management", se for prioridade B ou C.
   
   É importante copiar as issues que não são de apps parceiros para a pasta de "[3rd Party]3rd Party App Issue Management", pois nosso time irá tentar contato com as empresas para que elas resolvam essa issue.

## CASE ID: CIG-027

- **Resolve option (Medium):** `Request to 3rd party (Non Samsung Issue)`
- **Resolve Option (Small):** `3rd party App Defect`
- **Developer Thinking:** N/A
- **Modification rate:** `Neutral`

### Tester Approach

Common process: Google, buyers customization or social applications (WhatsApp, Facebook etc.)? Request 3rd_party Team process: When we contacted the responsible company 3 times and there was no response When we were able to open a ticket to correct the issue.

### Close option

`Request to 3rd party`

### Keywords

3rd party App Defect, Request to 3rd party (Non Samsung Issue), Request to 3rd party, third party app, 3rd party, external app, Google app, WhatsApp, Facebook, partner app

### Example questions

1. O desenvolvedor resolveu minha issue como "3rd party". Que ação devo tomar como testador, e qual close option devo usar?

**Answer**

    A issue que você reportou é de aplicativo Google ou META?
       * Se sim, o desenvolvedor deve colocar o ticket comprovando que ele reportou a issue para o app parceiro. Se ele não colocar o ticket solicite, só feche a issue se tiver o ticket.
       * Se não, feche a issue com a opção `Request to 3rd party`, após fechada clique no botão "Copy to other models" para abrir a issue na pasta "[3rd Party]3rd Party App Issue Management_Critical Issue", se for prioridade A, ou na pasta "[3rd Party]3rd Party App Issue Management", se for prioridade B ou C.
   
   É importante copiar as issues que não são de apps parceiros para a pasta de "[3rd Party]3rd Party App Issue Management", pois nosso time irá tentar contato com as empresas para que elas resolvam essa issue.

## CASE ID: CIG-028

- **Resolve option (Medium):** `Request to 3rd party (Non Samsung Issue)`
- **Resolve Option (Small):** `Except device(etc.)`
- **Developer Thinking:** N/A
- **Modification rate:** `Neutral`

### Tester Approach

Common process: Google, buyers customization or social applications (WhatsApp, Facebook etc.)? Request 3rd_party Team process: When we contacted the responsible company 3 times and there was no response When we were able to open a ticket to correct the issue.

### Close option

`Request to 3rd party`

### Keywords

Except device(etc.), Request to 3rd party (Non Samsung Issue), Request to 3rd party, external device, except device, non Samsung device, third party device

### Example questions

1. O desenvolvedor resolveu minha issue como "3rd party". Que ação devo tomar como testador, e qual close option devo usar?

**Answer**

    A issue que você reportou é de aplicativo Google ou META?
       * Se sim, o desenvolvedor deve colocar o ticket comprovando que ele reportou a issue para o app parceiro. Se ele não colocar o ticket solicite, só feche a issue se tiver o ticket.
       * Se não, feche a issue com a opção `Request to 3rd party`, após fechada clique no botão "Copy to other models" para abrir a issue na pasta "[3rd Party]3rd Party App Issue Management_Critical Issue", se for prioridade A, ou na pasta "[3rd Party]3rd Party App Issue Management", se for prioridade B ou C.
   
   É importante copiar as issues que não são de apps parceiros para a pasta de "[3rd Party]3rd Party App Issue Management", pois nosso time irá tentar contato com as empresas para que elas resolvam essa issue.

## CASE ID: CIG-029

- **Resolve option (Medium):** `Insufficient Defect Info.`
- **Resolve Option (Small):** `Need to add debugging code`
- **Developer Thinking:** When the TG in charge has added debugging code for log collection because the log related to the issues is not collected currently.
- **Modification rate:** `Bad Effect`

### Tester Approach

Action: Close this issue if you send all files dev requested and dev still points to insufficient defect info.

### Close option

`Not Fixed_Ireproducibility`

### Keywords

Need to add debugging code, Insufficient Defect Info., Not Fixed_Ireproducibility, debugging code, debug code, log collection, added debug code, the, charge, has, added, debugging, code, for, log

### Example questions

1. The developer selected Resolve option (Medium) = "Insufficient Defect Info." and Resolve Option (Small) = "Need to add debugging code". What action should I take as a tester, and which Close option should I use?

**Answer**

    Reproduce the issue again to collect new logs and video evidence, re-register the issue. Close this issue if you send all files dev requested and dev still points to insufficient defect info. 

2. O desenvolvedor resolveu minha issue como Insufficient Defect info, o quê eu faço?

**Answer**

    Reproduza o problema novamente para coletar novos logs e evidências em vídeo, dê re-register na issue. Feche este problema se você enviar todos os arquivos solicitados pelo dev e o dev ainda apontar para informações insuficientes sobre o defeito.

3. Qual a o close option pra issue resolvida como `Insufficient Defect Info.`?

**Answer**

   Deve ser fechada como `Not Fixed_Ireproducibility`

## CASE ID: CIG-030

- **Resolve option (Medium):** `Insufficient Defect Info.`
- **Resolve Option (Small):** `Delayed log extraction by user`
- **Developer Thinking:** In case user extracts logs delayed since issue occurred.
- **Modification rate:** `Bad Effect`

### Tester Approach

Action: Close this issue if you send all files dev requested and dev still points to insufficient defect info.

### Close option

`Not Fixed_Ireproducibility`

### Keywords

Delayed log extraction by user, Insufficient Defect Info., Not Fixed_Ireproducibility, delayed log, late log extraction, user extracted logs late, user, extracts, logs, delayed, since, occurred.

### Example questions

1. The developer selected Resolve option (Medium) = "Insufficient Defect Info." and Resolve Option (Small) = "Need to add debugging code". What action should I take as a tester, and which Close option should I use?

**Answer**

    Reproduce the issue again to collect new logs and video evidence, re-register the issue. Close this issue if you send all files dev requested and dev still points to insufficient defect info. 

2. O desenvolvedor resolveu minha issue como Insufficient Defect info, o quê eu faço?

**Answer**

    Reproduza o problema novamente para coletar novos logs e evidências em vídeo, dê re-register na issue. Feche este problema se você enviar todos os arquivos solicitados pelo dev e o dev ainda apontar para informações insuficientes sobre o defeito.

3. Qual a o close option pra issue resolvida como `Insufficient Defect Info.`?

**Answer**

   Deve ser fechada como `Not Fixed_Ireproducibility`

## CASE ID: CIG-031

- **Resolve option (Medium):** `Insufficient Defect Info.`
- **Resolve Option (Small):** `No required Logs/Broken files`
- **Developer Thinking:** No logs, broken file is attached. To analyze issue, different kind of log is required. (Ram dump, CP log, watch log…)
- **Modification rate:** `Bad Effect`

### Tester Approach

Action: Close this issue if you send all files dev requested and dev still points to insufficient defect info.

### Close option

`Not Fixed_Ireproducibility`

### Keywords

No required Logs/Broken files, Insufficient Defect Info., Not Fixed_Ireproducibility, missing logs, broken file, required logs, ram dump, CP log, watch log, logs, broken, file, attached., analyze, different, kind, log

### Example questions

1. The developer selected Resolve option (Medium) = "Insufficient Defect Info." and Resolve Option (Small) = "Need to add debugging code". What action should I take as a tester, and which Close option should I use?

**Answer**

    Reproduce the issue again to collect new logs and video evidence, re-register the issue. Close this issue if you send all files dev requested and dev still points to insufficient defect info. 

2. O desenvolvedor resolveu minha issue como Insufficient Defect info, o quê eu faço?

**Answer**

    Reproduza o problema novamente para coletar novos logs e evidências em vídeo, dê re-register na issue. Feche este problema se você enviar todos os arquivos solicitados pelo dev e o dev ainda apontar para informações insuficientes sobre o defeito.

3. Qual a o close option pra issue resolvida como `Insufficient Defect Info.`?

**Answer**

   Deve ser fechada como `Not Fixed_Ireproducibility`

## CASE ID: CIG-032

- **Resolve option (Medium):** `Insufficient Defect Info.`
- **Resolve Option (Small):** `Absence of device/contents for reproduction`
- **Developer Thinking:** In case issue occurred on specific device, device is required. In case issue occurred using specific contents(image, video file), contents is required.
- **Modification rate:** `Bad Effect`

### Tester Approach

Action: Close this issue if you send all files dev requested and dev still points to insufficient defect info.

### Close option

`Not Fixed_Ireproducibility`

### Keywords

Absence of device/contents for reproduction, Insufficient Defect Info., Not Fixed_Ireproducibility, missing device, missing content, reproduction device, image file, video file, specific content, occurred, device, required., contents, image, video, file

### Example questions

1. The developer selected Resolve option (Medium) = "Insufficient Defect Info." and Resolve Option (Small) = "Need to add debugging code". What action should I take as a tester, and which Close option should I use?

**Answer**

    Reproduce the issue again to collect new logs and video evidence, re-register the issue. Close this issue if you send all files dev requested and dev still points to insufficient defect info. 

2. O desenvolvedor resolveu minha issue como Insufficient Defect info, o quê eu faço?

**Answer**

    Reproduza o problema novamente para coletar novos logs e evidências em vídeo, dê re-register na issue. Feche este problema se você enviar todos os arquivos solicitados pelo dev e o dev ainda apontar para informações insuficientes sobre o defeito.

3. Qual a o close option pra issue resolvida como `Insufficient Defect Info.`?

**Answer**

   Deve ser fechada como `Not Fixed_Ireproducibility`

## CASE ID: CIG-033

- **Resolve option (Medium):** `Insufficient Defect Info.`
- **Resolve Option (Small):** `Unclear Issue/Reproduction Route/Issue time.`
- **Developer Thinking:** ‘Problem details’, ‘Reproduction Route’ are unclear. Insufficient issue time information. In case video file is required for understanding issue. (cannot reproduce with reproduction route)
- **Modification rate:** `Bad Effect`

### Tester Approach

Action: Close this issue if you send all files dev requested and dev still points to insufficient defect info.

### Close option

`Not Fixed_Ireproducibility`

### Keywords

Unclear Issue/Reproduction Route/Issue time., Insufficient Defect Info., Not Fixed_Ireproducibility, unclear issue, unclear reproduction, reproduction route, issue time, missing video, cannot reproduce, details, Reproduction, Route, are, unclear., Insufficient, time, information.

### Example questions

1. The developer selected Resolve option (Medium) = "Insufficient Defect Info." and Resolve Option (Small) = "Need to add debugging code". What action should I take as a tester, and which Close option should I use?

**Answer**

    Reproduce the issue again to collect new logs and video evidence, re-register the issue. Close this issue if you send all files dev requested and dev still points to insufficient defect info. 

2. O desenvolvedor resolveu minha issue como Insufficient Defect info, o quê eu faço?

**Answer**

    Reproduza o problema novamente para coletar novos logs e evidências em vídeo, dê re-register na issue. Feche este problema se você enviar todos os arquivos solicitados pelo dev e o dev ainda apontar para informações insuficientes sobre o defeito.

3. Qual a o close option pra issue resolvida como `Insufficient Defect Info.`?

**Answer**

   Deve ser fechada como `Not Fixed_Ireproducibility`

## CASE ID: CIG-034

- **Resolve option (Medium):** `Insufficient Defect Info.`
- **Resolve Option (Small):** `Insufficient log time coverage`
- **Developer Thinking:** Lack of log time coverage due to unnecessary logs in log buffer.
- **Modification rate:** `Bad Effect`

### Tester Approach

Action: Close this issue if you send all files dev requested and dev still points to insufficient defect info.

### Close option

`Not Fixed_Ireproducibility`

### Keywords

Insufficient log time coverage, Insufficient Defect Info., Not Fixed_Ireproducibility, log coverage, insufficient log time, log buffer, unnecessary logs, Lack, log, time, coverage, due, unnecessary, logs, buffer.

### Example questions

1. The developer selected Resolve option (Medium) = "Insufficient Defect Info." and Resolve Option (Small) = "Need to add debugging code". What action should I take as a tester, and which Close option should I use?

**Answer**

    Reproduce the issue again to collect new logs and video evidence, re-register the issue. Close this issue if you send all files dev requested and dev still points to insufficient defect info. 

2. O desenvolvedor resolveu minha issue como Insufficient Defect info, o quê eu faço?

**Answer**

    Reproduza o problema novamente para coletar novos logs e evidências em vídeo, dê re-register na issue. Feche este problema se você enviar todos os arquivos solicitados pelo dev e o dev ainda apontar para informações insuficientes sobre o defeito.

3. Qual a o close option pra issue resolvida como `Insufficient Defect Info.`?

**Answer**

   Deve ser fechada como `Not Fixed_Ireproducibility`

## CASE ID: CIG-035

- **Resolve option (Medium):** `Duplicated issue (cause side)`
- **Resolve Option (Small):** `N/A`
- **Developer Thinking:** Refer to issue of other model/GMS application that have some problem, same root cause
- **Modification rate:** `Neutral`

### Tester Approach

* If referenced issue is from another model, align with coodinator and reopen it.

* If referenced issue is reported by SIDIA member > Duplicated defect shall be closed after comparing issues.

* If referenced issue is reported by by another Region > Duplicated defect can be kepted as resolved and be retested (close issue) after representative issue is fixed.

### Close option

`Duplicated Issues (Cause side)`

### Keywords

Duplicated issue (cause side), Duplicated Issues (Cause side), not applicable, N/A, Refer, other, model/GMS, application, same, root, cause

### Example questions

1. The developer selected Resolve option (Medium) = "Duplicated issue (cause side)" and Resolve Option (Small) = "N/A". What action should I take as a tester, and which Close option should I use?

**Answer**

    * If referenced issue is from another model, align with coodinator and reopen it.
    * If referenced issue is reported by SIDIA member > Duplicated defect shall be closed after comparing issues.
    * If referenced issue is reported by by another Region > Duplicated defect can be kepted as resolved and be retested (close issue) after representative issue is fixed.

2. O desenvolvedor resolveu minha issue como duplicada de uma issue de outro modelo? Está certo, posso fechar?

**Answer**
    * Não é correto, avise o seu coordenador ou especialista para alinhar reabrir a issue.

3. O desenvolvedor resolveu minha issue como duplicada de uma issue de um membro do SIDIA? O que devo fazer?

**Answer**
    * Confirme se é a mesma issue, mesmo modelo e mesma CL de correção, se forem iguais você pode fechar a issue.

4. O desenvolvedor resolveu minha issue como duplicada de uma issue de um membro de outra região? O que devo fazer?

**Answer**
    * Feche a issue somente após a issue duplicada da outra região ser fechada.


## CASE ID: CIG-036

- **Resolve option (Medium):** `App Update via App Store`
- **Resolve Option (Small):** `N/A`
- **Developer Thinking:** The issue will be fixed through the app update (Galaxy apps or Play Store).
- **Modification rate:** `Good`

### Tester Approach

Action:

* If folder path is not informed, re-open and ask the developer for the folder path.

* If PLM shows the option to register in APK folder, .

* If PLM does not show this option, close and register another issue in APK folder.

* If PLM Separate DEV Type option does not appear, transfer issue to App folder and re-open. Fixed Action: Wait for apk new version and close it using latest SW released and app version.

### Close option

`Fixed_App update`

### Keywords

App Update via App Store, Fixed_App update, not applicable, N/A, The, fixed, through, app, update, Galaxy, apps, Play

### Example questions

1. The developer selected Resolve option (Medium) = "App Update via App Store" and Resolve Option (Small) = "N/A". What action should I take as a tester, and which Close option should I use?

**Answer**
    For Resolve option (Medium) = "App Update via App Store" and Resolve Option (Small) = "N/A", follow this Tester Approach exactly: Action: * If folder path is not informed, re-open and ask the developer for the folder path. * If PLM shows the option to register in APK folder, . * If PLM does not show this option, close and register another issue in APK folder. * If PLM Separate DEV Type option does not appear, transfer issue to App folder and re-open. Fixed Action: Wait for apk new version and close it using latest SW released and app version. Close option = "Fixed_App update".

2. Tenho uma issue resolvida como App Update, mas quando vou fechar está pedindo uma pasta pra mover a issue, qual pasta devo informar?

**Answer**
    Verifique se no campo "Cause" e "Countermeasure" o desenvolvedor colocou a pasta do aplicativo para a qual você deve mover a issue, se ele não colocou comente na issue e mande email pedindo a pasta. Reabra a issue caso não tenha resposta.

3. Tenho uma issue resolvida como "App Update" e ela está na pasta principal do projeto, mas ela ainda não está corrigida, devo esperar ser corrigida para fechar?

**Answer**
    Issues resolvidas como "App Update" que estão na pasta de projeto (Principal ou MR) não precisam estar corrigidas para serem fechadas. Ao fechar a issue será solicitada a pasta do aplicativo para qual a issue será movida, somente na pasta do aplicativo que você só deve fechar quando sair a versão do app com a issue corrigida.
    Ao fechar uma issue corrigida em versão de aplicativo sempre comente a versão onde a issue foi corrigida.

4. Estou tentando fechar uma issue como "App Update", mas não estou encontrando a pasta do app na hora de mover?

**Answer**
    Provavelmente a pasta do app é do tipo "Separate DEV Type" transfira a issue para a pasta do aplicativo diretamente e dê reopen




