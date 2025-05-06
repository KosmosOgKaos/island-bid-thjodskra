WITH inserted_person AS (
    INSERT INTO "Person" (name, kennitala, address, email, telephone, "createdAt", "updatedAt")
    VALUES (
        'Jökull Þórðarson',
        '1203894569',
        'Bláfjallagata 12, 105 Reykjavík',
        'jokull.thordarson@email.is',
        '772-8391',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id
),
inserted_submission AS (
    INSERT INTO "Submission" (year, status, index, "personId", "createdAt", "updatedAt")
    SELECT 
        2024,
        'Imported',
        1,
        id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    FROM inserted_person
    RETURNING id
),
inserted_incomes AS (
    INSERT INTO "Income" (type, payer, amount, currency, explanation, "submissionId", "createdAt", "updatedAt")
    SELECT 
        type::"IncomeType",
        payer,
        amount,
        currency::"Currency",
        explanation,
        (SELECT id FROM inserted_submission),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    FROM (VALUES 
        ('Wages', 'Norðurljós Software ehf', 9360000, 'ISK', NULL),
        ('Wages', 'Mús & Merki ehf.', 900000, 'ISK', NULL),
        ('Benefits', NULL, 120000, 'ISK', 'Dagpeningar'),
        ('Other', 'Norðurljós Software ehf', 75000, 'ISK', 'Íþróttastyrkur'),
        ('Other', 'VR', 130000, 'ISK', 'Starfsmenntastyrkur')
    ) AS incomes(type, payer, amount, currency, explanation)
    RETURNING id
),
inserted_properties AS (
    INSERT INTO "Property" (type, "valueName", value, currency, properties, "submissionId", "createdAt", "updatedAt")
    SELECT 
        type::"PropertyType",
        "valueName",
        value,
        currency::"Currency",
        properties,
        (SELECT id FROM inserted_submission),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    FROM (VALUES 
        ('DomesticProperty', 'Fasteignamat', 52000000, 'ISK', '{"fastanumer": "210-9876", "address": "Bláfjallagata 12"}'::jsonb),
        ('Vehicle', 'Kaupverð', 3100000, 'ISK', '{"registrationNumber": "KB-521", "yearOfPurchase": 2021}'::jsonb),
        ('Vehicle', 'Kaupverð', 430000, 'ISK', '{"registrationNumber": "JU-329", "yearOfPurchase": 2012}'::jsonb)
    ) AS properties(type, "valueName", value, currency, properties)
    RETURNING id
)
INSERT INTO "Debt" (description, type, currency, creditor, "creditorKennitala", "loanNumber", "loanStartDate", "loanDurationYears", "yearPaymentTotal", "nominalPaymentTotal", "interestPaymentTotal", remaining, properties, "submissionId", "createdAt", "updatedAt")
SELECT 
    description,
    type::"DebtType",
    currency::"Currency",
    creditor,
    "creditorKennitala",
    "loanNumber",
    "loanStartDate"::timestamp,
    "loanDurationYears",
    "yearPaymentTotal",
    "nominalPaymentTotal",
    "interestPaymentTotal",
    remaining,
    properties,
    (SELECT id FROM inserted_submission),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (VALUES 
    (NULL, 'OwnDomicile', 'ISK', 'Íslandsbanki hf.', '491008-0160', '56783900123', '2021-06-15T00:00:00Z', 30, 2280000, 1360000, 920000, 28540000, '{"domicileLocation": "Bláfjallagata 12", "yearOfPurchase": 2021}'::jsonb),
    ('Eftirstöðvar á korti númer: 4469 88XX XXXX 4567', 'Other', 'ISK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 39200, 217000, NULL),
    ('Aukalán', 'Other', 'ISK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 86000, 980000, NULL),
    ('0142-26-732645 Varðan', 'Other', 'ISK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 14500, 62000, NULL),
    ('Kílómetragjald, Skatturinn', 'Other', 'ISK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 2370, NULL),
    ('Þing- og sveitarsjóðsgjöld, Skatturinn', 'Other', 'ISK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 224, 0, NULL)
) AS debts(description, type, currency, creditor, "creditorKennitala", "loanNumber", "loanStartDate", "loanDurationYears", "yearPaymentTotal", "nominalPaymentTotal", "interestPaymentTotal", remaining, properties);
