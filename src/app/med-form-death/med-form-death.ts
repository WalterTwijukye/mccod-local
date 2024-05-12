
export interface Certificate {
    MOH_National_Case_Number: string,
    NIN: string,
    Inpatient_Number: string,
    Name: string,

    Region: string,
    District: string,
    County: string,
    Sub_County: string,
    Village: string,
    Occupation: string,
    Date_Of_Birth_Known?: boolean,
    Date_Of_Birth: Date,
    Age : {
        Years : number,
        Months: number,
        Days: number,
        Hours: number,
        Minutes: number
        
    },
    Sex : string,
    Date_Time_Of_Death: Date,

    causeOfDeath1: string,
    code1: string,
    causeOfDeathFreeText1: string, 
    Time_Interval_From_Onset_To_Death1: {
        Time_Interval_Unit1: string,
        Time_Interval_Qtty1: number
    },
    causeOfDeath2: string,
    code2: string,
    causeOfDeathFreeText2: string, 
    Time_Interval_From_Onset_To_Death2: {
        Time_Interval_Unit2: string,
        Time_Interval_Qtty2: number
    },
    causeOfDeath3: string,
    code3: string,
    causeOfDeathFreeText3: string, 
    Time_Interval_From_Onset_To_Death3: {
        Time_Interval_Unit3: string,
        Time_Interval_Qtty3: number
    },
    causeOfDeath4: string,
    code4: string,
    causeOfDeathFreeText4: string, 
    Time_Interval_From_Onset_To_Death4: {
        Time_Interval_Unit4: string,
        Time_Interval_Qtty4: number
    },
    
    causeOfDeath5: string,
    code5: string,
    causeOfDeathFreeText5: string, 
    causeOfDeath6: string,
    code6: string,
    causeOfDeathFreeText6: string, 
    causeOfDeath7: string,
    code7: string,
    causeOfDeathFreeText7: string, 
    causeOfDeath8: string,
    code8: string,
    causeOfDeathFreeText8: string, 
    causeOfDeath9: string,
    code9: string,
    causeOfDeathFreeText9: string, 

    State_Underlying_Cause: string,
    State_Underlying_Cause_Code: string,
    Doris_Underlying_Cause: string,
    Final_Underlying_Cause: string,

    lastSurgeryPerformed: '',
    dateOfSurgery: '',
    reasonForSurgery: '',
    autopsyRequested: '',
    findingsInCertification: '',

    disease?: boolean,
    accident?: boolean,
    intentionalSelfHarm?: boolean,
    assualt?: boolean,
    legalIntervention?: boolean,
    war?: boolean,
    notDetermined?: boolean,
    pendingInvenstigation?: boolean,
    unknown?: boolean,
    externalCause?: boolean,
    dateOfInjusry: Date,
    describeExternalCause: string,
    occuranceOfExternalCause: string,

    multiplePregnancy: string,
    stillBorn: string,
    numberOfHrsSurvived: number,
    birthWeight: number,
    numberOfCompletedPregWeeks: number,
    ageOfMother: number,
    conditionsDeathPerinatal: number,

    wasDeceasedPreg: string,
    atWhatPoint: string,
    didPregancyContributeToDeath: string,
    parity: string;
    modeOfDelivery: string,
    placeOfDelivery: string,
    deliveredBySkilledAttendant: string,

    I_Attended_Deceased?: boolean,
    I_Examined_Body?: boolean,
    I_Conducted_PostMortem?: boolean,
    Other: string,
    examinedBy: string    
}