
import { Component, ElementRef, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'node_modules/bootstrap/';
import { NgForm } from '@angular/forms';
import { IndexeddbService } from '../indexeddb.service';
import * as ECT from "@whoicd/icd11ect";
import { FacilityService } from '../facility.service';
import { FacilityData } from '../facility.model';
import { JsonParserService } from 'src/json-parser.service';
import { FormHeaderComponent } from '../form-header/form-header.component';
import { DataService } from '../data-service.service';
import { ChangeDetectorRef } from '@angular/core';
import { interval } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-med-form-death',
  templateUrl: './med-form-death.component.html',
  styleUrls: ['./med-form-death.component.css',]
})

export class MedFormDeathComponent implements OnInit {

  entities: any[] = []; // Array to store selectedEntity objects
  finalUC: any[] = [];
  dorisObj!: {};
  report!: '';

  facility: string = '';
  private facilityKnob: string = 'ai-ConnecT@2024'; 
  facilities: { id: string, name: string }[] = [];
  selectedFacilityId!: string;
  selectedOption: string = '';

  totalRecords !: number;
  sentToApiTrueRecords !: number;
  sentToApiFalseRecords !: number;

  selectedRecordId: number | null = null;
  editFormData: any = {};
  searchText: string = '';
  deceasedRecords: any[] = [];
  filteredRecords: any[] = [];

  formData = {

    eventId: '',
    MOH_National_Case_Number: '',
    NIN: '',
    Inpatient_Number: '',
    Name: '',
    Region: '',
    District: '',
    County: '',
    Sub_County: '',
    Village: '',
    placeOfDeath: '',
    Occupation: '',
    Date_Of_Birth_Known: '',
    Date_Of_Birth_notKnown: '',
    Date_Of_Birth: '',

    Age: {
      Years: '',
      Months: '',
      Days: '',
      Hours: '',
      Minutes: ''

    },
    Sex: '',
    Date_Time_Of_Death: '',

    causeOfDeath1: '',
    code1: '',
    causeOfDeathFreeText1: '',
    Time_Interval_From_Onset_To_Death1: {
      Time_Interval_Unit1: '',
      Time_Interval_Qtty1: ''
    },
    causeOfDeath2: '',
    code2: '',
    causeOfDeathFreeText2: '',
    Time_Interval_From_Onset_To_Death2: {
      Time_Interval_Unit2: '',
      Time_Interval_Qtty2: ''
    },
    causeOfDeath3: '',
    code3: '',
    causeOfDeathFreeText3: '',
    Time_Interval_From_Onset_To_Death3: {
      Time_Interval_Unit3: '',
      Time_Interval_Qtty3: ''
    },
    causeOfDeath4: '',
    code4: '',
    causeOfDeathFreeText4: '',
    Time_Interval_From_Onset_To_Death4: {
      Time_Interval_Unit4: '',
      Time_Interval_Qtty4: ''
    },
    causeOfDeath5: '',
    code5: '',
    causeOfDeathFreeText5: '',
    causeOfDeath6: '',
    code6: '',
    causeOfDeathFreeText6: '',
    causeOfDeath7: '',
    code7: '',
    causeOfDeathFreeText7: '',
    causeOfDeath8: '',
    code8: '',
    causeOfDeathFreeText8: '',
    causeOfDeath9: '',
    code9: '',
    causeOfDeathFreeText9: '',

    State_Underlying_Cause: '',
    State_Underlying_Cause_Code: '',
    Doris_Underlying_Cause: '',
    dorisCode: '',
    Final_Underlying_Cause: '',
    Final_Underlying_CauseCode: '',

    lastSurgeryPerformed: '',
    dateOfSurgery: '',
    reasonForSurgery: '',
    autopsyRequested: '',
    findingsInCertification: '',

    disease: '',
    accident: '',
    intentionalSelfHarm: '',
    assault: '',
    legalIntervention: '',
    war: '',
    notDetermined: '',
    pendingInvenstigation: '',
    unknown: '',
    externalCause: '',
    dateOfInjury: '',
    describeExternalCause: '',
    occuranceOfExternalCause: '',

    multiplePregnancy: '',
    stillBorn: '',
    numberOfHrsSurvived: '',
    birthWeight: '',
    numberOfCompletedPregWeeks: '',
    ageOfMother: '',
    conditionsPerinatalDeath: '',

    wasDeceasedPreg: '',
    atWhatPoint: '',
    didPregancyContributeToDeath: '',
    parity: '',
    modeOfDelivery: '',
    placeOfDelivery: '',
    deliveredBySkilledAttendant: '',

    I_Attended_Deceased: '',
    I_Examined_Body: '',
    I_Conducted_PostMortem: '',
    Other: '',
    examinedBy: '',

    sentToApi: 'false',
  }

  codes: string[] = []; // Array to store codes

  // Fields to encrypt/decrypt
  private fieldsToEncrypt: string[] = [
    'Name',
  ];
  // Fields to decrypt (assuming they are encrypted in the database)
  private fieldsToDecrypt: string[] = [
    'Name',
  ];

  @ViewChild(FormHeaderComponent) formHeader!: FormHeaderComponent; // Get a reference to FormHeaderComponent
  @ViewChild('formDataForm') form!: NgForm; // Add this line

  constructor(
    private indexeddbService: IndexeddbService,
    private jsonParserService: JsonParserService,
    private facilityService: FacilityService,
    private dataService: DataService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef // Add this line

  ) {}

  ngOnInit(): void {

    const decryptedName = this.decryptName(this.formData.Name);

    this.autoResendToApi();

    interval(5000).subscribe(() => {
      this.autoResendToApi();
      this.countRecords();
      this.deceasedRecords;
      this.indexeddbService.getAllMedicalCertificates()
        .then(records => {
          this.deceasedRecords = records.map(record => ({
            id: record.id,
            sex: record.Sex,
            age: record.Age.Years,
            // Assign values to formData properties
            eventId: record.EventId,
            MOH_National_Case_Number: record.MOH_National_Case_Number,
            NIN: record.NIN,
            Inpatient_Number: record.Inpatient_Number,
            Name: decryptedName,
            Region: record.Region,
            District: record.District,
            County: record.County,
            Sub_County: record.Sub_County,
            Village: record.Village,
            placeOfDeath: record.placeOfDeath,
            Occupation: record.Occupation,
            Date_Of_Birth_Known: record.Date_Of_Birth_Known,
            Date_Of_Birth_notKnown: record.Date_Of_Birth_notKnown,
            Date_Of_Birth: record.Date_Of_Birth,
            Age: {
              Years: record.Age.Years,
              Months: record.Age.Months,
              Days: record.Age.Days,
              Hours: record.Age.Hours,
              Minutes: record.Age.Minutes
            },
            Sex: record.Sex,
            Date_Time_Of_Death: record.Date_Time_Of_Death,
            causeOfDeath1: record.causeOfDeath1,
            code1: record.code1,
            causeOfDeathFreeText1: record.causeOfDeathFreeText1,
            Time_Interval_From_Onset_To_Death1: {
              Time_Interval_Unit1: record.Time_Interval_From_Onset_To_Death1.Time_Interval_Unit1,
              Time_Interval_Qtty1: record.Time_Interval_From_Onset_To_Death1.Time_Interval_Qtty1
            },
            causeOfDeath2: record.causeOfDeath2,
            code2: record.code2,
            causeOfDeathFreeText2: record.causeOfDeathFreeText2,
            Time_Interval_From_Onset_To_Death2: {
              Time_Interval_Unit2: record.Time_Interval_From_Onset_To_Death2.Time_Interval_Unit2,
              Time_Interval_Qtty2: record.Time_Interval_From_Onset_To_Death2.Time_Interval_Qtty2
            },
            // Repeat the same pattern for other causeOfDeath properties
            State_Underlying_Cause: record.State_Underlying_Cause,
            State_Underlying_Cause_Code: record.State_Underlying_Cause_Code,
            Doris_Underlying_Cause: record.Doris_Underlying_Cause,
            dorisCode: record.dorisCode,
            Final_Underlying_Cause: record.Final_Underlying_Cause,
            Final_Underlying_CauseCode: record.Final_Underlying_CauseCode,
            lastSurgeryPerformed: record.lastSurgeryPerformed,
            dateOfSurgery: record.dateOfSurgery,
            reasonForSurgery: record.reasonForSurgery,
            autopsyRequested: record.autopsyRequested,
            findingsInCertification: record.findingsInCertification,
            disease: record.disease,
            accident: record.accident,
            intentionalSelfHarm: record.intentionalSelfHarm,
            assault: record.assault,
            legalIntervention: record.legalIntervention,
            war: record.war,
            notDetermined: record.notDetermined,
            pendingInvenstigation: record.pendingInvenstigation,
            unknown: record.unknown,
            externalCause: record.externalCause,
            dateOfInjury: record.dateOfInjury,
            describeExternalCause: record.describeExternalCause,
            occuranceOfExternalCause: record.occuranceOfExternalCause,
            multiplePregnancy: record.multiplePregnancy,
            stillBorn: record.stillBorn,
            numberOfHrsSurvived: record.numberOfHrsSurvived,
            birthWeight: record.birthWeight,
            numberOfCompletedPregWeeks: record.numberOfCompletedPregWeeks,
            ageOfMother: record.ageOfMother,
            conditionsPerinatalDeath: record.conditionsPerinatalDeath,
            wasDeceasedPreg: record.wasDeceasedPreg,
            atWhatPoint: record.atWhatPoint,
            didPregancyContributeToDeath: record.didPregancyContributeToDeath,
            parity: record.parity,
            modeOfDelivery: record.modeOfDelivery,
            placeOfDelivery: record.placeOfDelivery,
            deliveredBySkilledAttendant: record.deliveredBySkilledAttendant,
            I_Attended_Deceased: record.I_Attended_Deceased,
            I_Examined_Body: record.I_Examined_Body,
            I_Conducted_PostMortem: record.I_Conducted_PostMortem,
            Other: record.Other,
            examinedBy: record.examinedBy,
            sentToApi: record.sentToApi,
          }));
        })
        .catch(error => console.error('Error fetching medical certificates:', error));
    });

    // Check if there's a cached facility option available
    const cachedFacility = localStorage.getItem('selectedFacility');
    const cachedFacilityId = localStorage.getItem('selectedFacilityId');
    if (cachedFacility && cachedFacilityId) {
      // Update the form heading with the cached facility option
      this.facility = cachedFacility;
      this.selectedFacilityId = cachedFacilityId;
      this.dataService.checkAndUpdateFacilityData(cachedFacilityId);
    }

    this.facilityService.getFacilities().then((facilityData: FacilityData) => {
      this.facilities = facilityData.organisationUnits;
    });

    const mySettings = {
      // apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
      apiServerUrl: "http://localhost:8382/",
      height: "60vh"
    };

    const myCallbacks = {

      selectedEntityFunction: (selectedEntity: any) => {

        let value = `causeOfDeath${selectedEntity.iNo}`;
        let code = `code${selectedEntity.iNo}`;
        (this.formData as any)[value] = selectedEntity.bestMatchText;
        (this.formData as any)[code] = selectedEntity.code;

        this.formData.State_Underlying_Cause = selectedEntity.bestMatchText;
        this.formData.State_Underlying_Cause_Code = selectedEntity.code;
        console.log(selectedEntity);
        // Push the selected entity's code to the array of codes
        this.codes[selectedEntity.iNo - 1] = selectedEntity.code;

        // this.enableDoris(this.codes);
        this.entities.push(selectedEntity); // Push selectedEntity to the array
        console.log('Entities:', this.entities);

        this.enableDoris(this.codes);

        this.finalUC = [
          this.entities[this.entities.length - 1],
        ]

        // Clear entity (if needed)
        ECT.Handler.clear(selectedEntity.iNo);

      },


    };

    ECT.Handler.configure(mySettings, myCallbacks);

    for (let i = 1; i <= 9; i++) {
      ECT.Handler.overwriteConfiguration(String(i), {
        chaptersFilter: "18;19;20;21;22;23;24;25;26",
        wordsAvailable: false
      });
    }
    // Initialize the array of codes with 4 empty strings
    this.codes = Array(9).fill('');
    this.countRecords();

  }
  // ======= Encryption ============ 

  private encryptName(fieldname: string): string {
    return CryptoJS.AES.encrypt(fieldname, this.facilityKnob).toString();
  }

  private decryptName(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.facilityKnob);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // =============== Doris ==================== 

  enableDoris(codes: string[]) {
    // Check if all codes are present
    if (codes.some(code => !!code || code === '')) {
      // Construct the URL with all four codes
      const url = `https://ug.sk-engine.cloud/icd-api/icd/release/11/2023-01/doris?` +
        `causeOfDeathCodeA=${codes[0]}&causeOfDeathCodeB=${codes[1]}` +
        `&causeOfDeathCodeC=${codes[2]}&causeOfDeathCodeD=${codes[3]}` +
        `&causeOfDeathCodeE=${codes[4]}&causeOfDeathCodeF=${codes[5]}` +
        `&causeOfDeathCodeG=${codes[6]}&causeOfDeathCodeH=${codes[7]}` +
        `&causeOfDeathCodeI=${codes[8]}}`;
      const headers = new HttpHeaders().set('API-Version', 'v2');

      // Make the HTTP GET request
      this.http.get(url, { headers }).subscribe(
        (response: any) => {
          console.log('Doris Codes:', codes);
          console.log('Response:', response);
          // Handle the response as needed

          // Extract stemCode and Report from the response
          const stemCode = response.stemCode;
          this.report = response.report;
          // Update the dorisCode input field with the stemCode value
          // Update the dorisCode input field with the stemCode value
          console.log(stemCode);

          const matchedEntity = this.entities.find(entity => stemCode.includes(entity.code));
          if (matchedEntity) {
            const bestMatchText = matchedEntity.bestMatchText;
            console.log('Best Match Text:', bestMatchText);
            // Handle the bestMatchText as needed
            this.updateDorisCodeInput(stemCode, bestMatchText);
          } else {
            console.log('No entity found with matching code:', stemCode);
          }

        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      console.log('At least one code should be entered.');
    }
  }

  // Function to update the dorisCode input field with the stemCode value
  private updateDorisCodeInput(stemCode: string, bestMatchText: string): void {
    // Find the doris input element using ElementRef
    const dorisCodeInput: HTMLInputElement | null = this.elementRef.nativeElement.querySelector('#dorisCode');
    const dorisTextInput: HTMLInputElement | null = this.elementRef.nativeElement.querySelector('#Doris_Underlying_Cause');
    // Update the value attribute of the input element
    if (dorisCodeInput && dorisTextInput) {
      dorisCodeInput.value = stemCode;
      dorisTextInput.value = bestMatchText;

      this.dorisObj = {
        bestMatchText: bestMatchText,
        code: stemCode
      }
      this.finalUC.push(this.dorisObj);

    } else {
      console.error('doris input element not found.');
    }
  }

  updateUnderlyingCauseCode(event: Event) {
    // Find the entity object with the selected bestMatchText
    const target = event.target as HTMLInputElement;
    const selectedValue = target.value;
    const matchedEntity = this.finalUC.find(entity => entity.bestMatchText === selectedValue);
    if (matchedEntity) {
      // Update the value of the input field with the corresponding code
      console.log(matchedEntity);
      this.formData.Final_Underlying_CauseCode = matchedEntity.code;
    } else {
      // Clear the input field if no matching entity is found
      this.formData.Final_Underlying_CauseCode = '';
    }
  }

  // ========= Submission =========

  autoResendToApi() {
    this.indexeddbService.getAllUnsentRecords().then((records: any[]) => {
      records.forEach(record => {
        this.sendPayload(record);

      });
      // alert('Data RESENT to DHIS2 successfully:');
    }).catch(error => {
      console.error('Error fetching unsent records:', error);
      alert('Error fetching unsent records:');
    });
    this.countRecords();
  }

  submitForm(f: NgForm) {
    // Encrypt the "Name" field before submitting the form  
    console.log(this.facilityKnob);  
    const encryptedName = this.encryptName(this.formData.Name);
    console.log('Encrypted Name:', encryptedName);
    this.formData.Name = encryptedName;
    
    // Generate DHIS2 event UID
    const generateEventUID = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const length = 11; // Adjust the length of the UID as needed
      let uid = '';
      for (let i = 0; i < length; i++) {
        uid += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return uid;
    };

    // Generate the event UID
    const event = generateEventUID();
    this.formData.eventId = event;

    this.indexeddbService.addMedicalCertificate(this.formData).then(response => {
      console.log(response.message); // Output: "Record successfully saved"
      alert('Data successfully saved locally.');

      this.autoResendToApi();
      this.countRecords();
      console.log(response.id);
      console.log(response.data); // Output: { id: 1, name: 'John Doe', NIN: '1234567890', dateOfBirth: '1990-01-01', ... }

    }).catch(error => {
      console.error(error);
    });
  }

  sendPayload(formData: any) {
    const dateOfBirth = formData.Date_Of_Birth;
    const newDob = dateOfBirth + 'T00:00:00';
    const decryptedName = this.decryptName(formData.Name);
    // const newDob = new Date(dateOfBirth);
    // const newDoB = this.datePipe.transform(newDob, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS');

    const dateTimeDeath = formData.Date_Time_Of_Death;
    const newDtd = dateTimeDeath + 'T00:00:00';
    const payload = {
      event: formData.eventId,
      name: decryptedName,
      nin: formData.NIN,
      dob: newDob,
      age: formData.Age.Years,
      sex: formData.Sex,
      dtD: newDtd,
      orgUnit: this.selectedFacilityId
    }

    console.log(payload.orgUnit);
    console.log('Decrypted Name: ', decryptedName);
    console.log(payload);

    this.jsonParserService.sendData(payload).subscribe(
      response => {
        this.indexeddbService.sentToAPI(formData.id, 'true');
        formData.sentToApi = 'true';
        this.countRecords();

        console.log(formData.sentToApi);
        console.log('Data sent to DHIS2 successfully:', response);
        this.cdr.detectChanges();
        // alert('Data sent to DHIS2 successfully:');
      },
      error => {

        this.indexeddbService.sentToAPI(formData.id, 'false');
        formData.sentToApi = 'false';
        this.countRecords();

        console.error('Error sending data:', error);
        // alert('Record NOT sent to DHIS2');
        this.cdr.detectChanges();
      }
    );
  }

  // Method to handle selection of facility option
  selectFacility() {
    // Cache the selected facility option
    localStorage.setItem('selectedFacility', this.selectedOption);
    // Update the form heading with the selected facility option
    this.facility = this.selectedOption;
    // Update the selectedFacilityId property with the selected facility's ID
    const selectedFacility = this.facilities.find(facility => facility.name === this.selectedOption);
    if (selectedFacility) {

      this.selectedFacilityId = selectedFacility.id;
      localStorage.setItem('selectedFacilityId', this.selectedFacilityId);
      console.log(this.selectedFacilityId);
      // Call DataService method to update selected facility ID

    }
  }

  async countRecords() {
    try {
      // Get all medical certificates
      const allRecords = await this.indexeddbService.getAllMedicalCertificates();
      const totalRecords = allRecords.length;

      // Get all medical certificates where sentToApi is true
      const sentToApiTrueRecords = allRecords.filter(record => record.sentToApi === 'true').length;

      // Get all medical certificates where sentToApi is false
      const sentToApiFalseRecords = allRecords.filter(record => record.sentToApi === 'false').length;

      // Log the counts
      console.log({
        'Total Records': totalRecords,
        'Records Sent to API': sentToApiTrueRecords,
        'Records Not Sent to API': sentToApiFalseRecords
      });

      // Optionally, you can assign these counts to component properties for use in your HTML template
      this.totalRecords = totalRecords;
      this.sentToApiTrueRecords = sentToApiTrueRecords;
      this.sentToApiFalseRecords = sentToApiFalseRecords;
    } catch (error) {
      console.error('Error counting records:', error);
      // Handle error, e.g., display error message
    }
  }

  // Method to handle edit button click
  onEdit(event: Event, recordId: number | null) {
    event.stopPropagation();
    console.log('Record ID Selected:', recordId);
    if (recordId !== null) {
      this.selectedRecordId = recordId;
      const selectedRecord = this.deceasedRecords.find(record => record.id === recordId);
      if (selectedRecord) {
        this.elementRef.nativeElement.querySelector('#Name').value = selectedRecord.name;
        this.elementRef.nativeElement.querySelector('#Sex').value = selectedRecord.sex;
        this.elementRef.nativeElement.querySelector('#Age').value = selectedRecord.age;
        this.elementRef.nativeElement.querySelector('#eventId').value = selectedRecord.eventId;
        this.elementRef.nativeElement.querySelector('#MOH_National_Case_Number').value = selectedRecord.MOH_National_Case_Number;
        this.elementRef.nativeElement.querySelector('#NIN').value = selectedRecord.NIN;
        this.elementRef.nativeElement.querySelector('#Inpatient_Number').value = selectedRecord.Inpatient_Number;
        this.elementRef.nativeElement.querySelector('#Region').value = selectedRecord.Region;
        this.elementRef.nativeElement.querySelector('#District').value = selectedRecord.District;
        this.elementRef.nativeElement.querySelector('#County').value = selectedRecord.County;
        this.elementRef.nativeElement.querySelector('#Sub_County').value = selectedRecord.Sub_County;
        this.elementRef.nativeElement.querySelector('#Village').value = selectedRecord.Village;
        this.elementRef.nativeElement.querySelector('#placeOfDeath').value = selectedRecord.placeOfDeath;
        this.elementRef.nativeElement.querySelector('#Occupation').value = selectedRecord.Occupation;
        this.elementRef.nativeElement.querySelector('#Date_Of_Birth_Known').value = selectedRecord.Date_Of_Birth_Known;
        this.elementRef.nativeElement.querySelector('#Date_Of_Birth_notKnown').value = selectedRecord.Date_Of_Birth_notKnown;
        this.elementRef.nativeElement.querySelector('#Date_Of_Birth').value = selectedRecord.Date_Of_Birth;
        this.elementRef.nativeElement.querySelector('#Sex').value = selectedRecord.Sex;
        this.elementRef.nativeElement.querySelector('#Date_Time_Of_Death').value = selectedRecord.Date_Time_Of_Death;
        this.elementRef.nativeElement.querySelector('#causeOfDeath1').value = selectedRecord.causeOfDeath1;
        this.elementRef.nativeElement.querySelector('#code1').value = selectedRecord.code1;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText1').value = selectedRecord.causeOfDeathFreeText1;
        this.elementRef.nativeElement.querySelector('#Time_Interval_Unit1').value = selectedRecord.Time_Interval_From_Onset_To_Death1.Time_Interval_Unit1;
        this.elementRef.nativeElement.querySelector('#Time_Interval_Qtty1').value = selectedRecord.Time_Interval_From_Onset_To_Death1.Time_Interval_Qtty1;
        this.elementRef.nativeElement.querySelector('#causeOfDeath2').value = selectedRecord.causeOfDeath2;
        this.elementRef.nativeElement.querySelector('#code2').value = selectedRecord.code2;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText2').value = selectedRecord.causeOfDeathFreeText2;
        this.elementRef.nativeElement.querySelector('#Time_Interval_Unit2').value = selectedRecord.Time_Interval_From_Onset_To_Death2.Time_Interval_Unit2;
        this.elementRef.nativeElement.querySelector('#Time_Interval_Qtty2').value = selectedRecord.Time_Interval_From_Onset_To_Death2.Time_Interval_Qtty2;
        // Repeat the pattern for other properties as needed
        this.elementRef.nativeElement.querySelector('#causeOfDeath3').value = selectedRecord.causeOfDeath3;
        this.elementRef.nativeElement.querySelector('#code3').value = selectedRecord.code3;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText3').value = selectedRecord.causeOfDeathFreeText3;
        this.elementRef.nativeElement.querySelector('#Time_Interval_Unit3').value = selectedRecord.Time_Interval_From_Onset_To_Death3.Time_Interval_Unit3;
        this.elementRef.nativeElement.querySelector('#Time_Interval_Qtty3').value = selectedRecord.Time_Interval_From_Onset_To_Death3.Time_Interval_Qtty3;
        this.elementRef.nativeElement.querySelector('#causeOfDeath4').value = selectedRecord.causeOfDeath4;
        this.elementRef.nativeElement.querySelector('#code4').value = selectedRecord.code4;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText4').value = selectedRecord.causeOfDeathFreeText4;
        this.elementRef.nativeElement.querySelector('#Time_Interval_Unit4').value = selectedRecord.Time_Interval_From_Onset_To_Death4.Time_Interval_Unit4;
        this.elementRef.nativeElement.querySelector('#Time_Interval_Qtty4').value = selectedRecord.Time_Interval_From_Onset_To_Death4.Time_Interval_Qtty4;
        this.elementRef.nativeElement.querySelector('#causeOfDeath5').value = selectedRecord.causeOfDeath5;
        this.elementRef.nativeElement.querySelector('#code5').value = selectedRecord.code5;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText5').value = selectedRecord.causeOfDeathFreeText5;
        this.elementRef.nativeElement.querySelector('#causeOfDeath6').value = selectedRecord.causeOfDeath6;
        this.elementRef.nativeElement.querySelector('#code6').value = selectedRecord.code6;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText6').value = selectedRecord.causeOfDeathFreeText6;
        this.elementRef.nativeElement.querySelector('#causeOfDeath7').value = selectedRecord.causeOfDeath7;
        this.elementRef.nativeElement.querySelector('#code7').value = selectedRecord.code7;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText7').value = selectedRecord.causeOfDeathFreeText7;
        this.elementRef.nativeElement.querySelector('#causeOfDeath8').value = selectedRecord.causeOfDeath8;
        this.elementRef.nativeElement.querySelector('#code8').value = selectedRecord.code8;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText8').value = selectedRecord.causeOfDeathFreeText8;
        this.elementRef.nativeElement.querySelector('#causeOfDeath9').value = selectedRecord.causeOfDeath9;
        this.elementRef.nativeElement.querySelector('#code9').value = selectedRecord.code9;
        this.elementRef.nativeElement.querySelector('#causeOfDeathFreeText9').value = selectedRecord.causeOfDeathFreeText9;
        this.elementRef.nativeElement.querySelector('#State_Underlying_Cause').value = selectedRecord.State_Underlying_Cause;
        this.elementRef.nativeElement.querySelector('#State_Underlying_Cause_Code').value = selectedRecord.State_Underlying_Cause_Code;
        this.elementRef.nativeElement.querySelector('#Doris_Underlying_Cause').value = selectedRecord.Doris_Underlying_Cause;
        this.elementRef.nativeElement.querySelector('#dorisCode').value = selectedRecord.dorisCode;
        this.elementRef.nativeElement.querySelector('#Final_Underlying_Cause').value = selectedRecord.Final_Underlying_Cause;
        this.elementRef.nativeElement.querySelector('#Final_Underlying_CauseCode').value = selectedRecord.Final_Underlying_CauseCode;
        this.elementRef.nativeElement.querySelector('#lastSurgeryPerformed').value = selectedRecord.lastSurgeryPerformed;
        this.elementRef.nativeElement.querySelector('#dateOfSurgery').value = selectedRecord.dateOfSurgery;
        this.elementRef.nativeElement.querySelector('#reasonForSurgery').value = selectedRecord.reasonForSurgery;
        this.elementRef.nativeElement.querySelector('#autopsyRequested').value = selectedRecord.autopsyRequested;
        this.elementRef.nativeElement.querySelector('#findingsInCertification').value = selectedRecord.findingsInCertification;
        this.elementRef.nativeElement.querySelector('#disease').value = selectedRecord.disease;
        this.elementRef.nativeElement.querySelector('#accident').value = selectedRecord.accident;
        this.elementRef.nativeElement.querySelector('#intentionalSelfHarm').value = selectedRecord.intentionalSelfHarm;
        this.elementRef.nativeElement.querySelector('#assault').value = selectedRecord.assault;
        this.elementRef.nativeElement.querySelector('#legalIntervention').value = selectedRecord.legalIntervention;
        this.elementRef.nativeElement.querySelector('#war').value = selectedRecord.war;
        this.elementRef.nativeElement.querySelector('#notDetermined').value = selectedRecord.notDetermined;
        this.elementRef.nativeElement.querySelector('#pendingInvenstigation').value = selectedRecord.pendingInvenstigation;
        this.elementRef.nativeElement.querySelector('#unknown').value = selectedRecord.unknown;
        this.elementRef.nativeElement.querySelector('#externalCause').value = selectedRecord.externalCause;
        this.elementRef.nativeElement.querySelector('#dateOfInjury').value = selectedRecord.dateOfInjury;
        this.elementRef.nativeElement.querySelector('#describeExternalCause').value = selectedRecord.describeExternalCause;
        this.elementRef.nativeElement.querySelector('#occuranceOfExternalCause').value = selectedRecord.occuranceOfExternalCause;
        this.elementRef.nativeElement.querySelector('#multiplePregnancy').value = selectedRecord.multiplePregnancy;
        this.elementRef.nativeElement.querySelector('#stillBorn').value = selectedRecord.stillBorn;
        this.elementRef.nativeElement.querySelector('#numberOfHrsSurvived').value = selectedRecord.numberOfHrsSurvived;
        this.elementRef.nativeElement.querySelector('#birthWeight').value = selectedRecord.birthWeight;
        this.elementRef.nativeElement.querySelector('#numberOfCompletedPregWeeks').value = selectedRecord.numberOfCompletedPregWeeks;
        this.elementRef.nativeElement.querySelector('#ageOfMother').value = selectedRecord.ageOfMother;
        this.elementRef.nativeElement.querySelector('#conditionsPerinatalDeath').value = selectedRecord.conditionsPerinatalDeath;
        this.elementRef.nativeElement.querySelector('#wasDeceasedPreg').value = selectedRecord.wasDeceasedPreg;
        this.elementRef.nativeElement.querySelector('#atWhatPoint').value = selectedRecord.atWhatPoint;
        this.elementRef.nativeElement.querySelector('#didPregancyContributeToDeath').value = selectedRecord.didPregancyContributeToDeath;
        this.elementRef.nativeElement.querySelector('#parity').value = selectedRecord.parity;
        this.elementRef.nativeElement.querySelector('#modeOfDelivery').value = selectedRecord.modeOfDelivery;
        this.elementRef.nativeElement.querySelector('#placeOfDelivery').value = selectedRecord.placeOfDelivery;
        this.elementRef.nativeElement.querySelector('#deliveredBySkilledAttendant').value = selectedRecord.deliveredBySkilledAttendant;
        this.elementRef.nativeElement.querySelector('#I_Attended_Deceased').value = selectedRecord.I_Attended_Deceased;
        this.elementRef.nativeElement.querySelector('#I_Examined_Body').value = selectedRecord.I_Examined_Body;
        this.elementRef.nativeElement.querySelector('#I_Conducted_PostMortem').value = selectedRecord.I_Conducted_PostMortem;
        this.elementRef.nativeElement.querySelector('#Other').value = selectedRecord.Other;
        this.elementRef.nativeElement.querySelector('#examinedBy').value = selectedRecord.examinedBy;
        this.elementRef.nativeElement.querySelector('#sentToApi').value = selectedRecord.sentToApi;
      } else {
        console.error('Record not found');
      }
    }
  }

  updateRecord(event: Event) {
    event.stopPropagation();
    // Ensure that there's a selected record ID
    if (this.selectedRecordId !== null) {
      // Call the IndexedDB service to update the record
      this.indexeddbService.editMedicalCertificate(this.selectedRecordId, this.formData)
        .then(response => {
          console.log(response.message); // Output: "Record updated successfully"
          alert('Record updated successfully.');
          // Fetch fresh records from IndexedDB and update the UI
          this.fetchRecords();
        })
        .catch(error => {
          console.error('Error updating record:', error);
          alert('Error updating record.');
        });
    } else {
      console.error('No record ID selected.');
      alert('No record selected.');
    }
  }

  deleteRecord(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this record?')) {
      this.indexeddbService.deleteMedicalCertificate(id)
        .then(() => {
          console.log('Record deleted successfully');
          alert('Record deleted successfully.');
          // Fetch fresh records from IndexedDB and update the UI
          this.fetchRecords();
        })
        .catch(error => {
          console.error('Error deleting record:', error);
          // Optionally, handle the error and display a message to the user
        });
    }
  }

  fetchRecords() {
    // Fetch updated records from IndexedDB
    const decryptedName = this.decryptName(this.formData.Name);
    this.indexeddbService.getAllMedicalCertificates()
      .then(records => {
        this.deceasedRecords = records.map(record => ({
          id: record.id,
          sex: record.Sex,
          age: record.Age.Years,
          // Assign values to formData properties
          eventId: record.EventId,
          MOH_National_Case_Number: record.MOH_National_Case_Number,
          NIN: record.NIN,
          Inpatient_Number: record.Inpatient_Number,
          Name: decryptedName,
          Region: record.Region,
          District: record.District,
          County: record.County,
          Sub_County: record.Sub_County,
          Village: record.Village,
          placeOfDeath: record.placeOfDeath,
          Occupation: record.Occupation,
          Date_Of_Birth_Known: record.Date_Of_Birth_Known,
          Date_Of_Birth_notKnown: record.Date_Of_Birth_notKnown,
          Date_Of_Birth: record.Date_Of_Birth,
          Age: {
            Years: record.Age.Years,
            Months: record.Age.Months,
            Days: record.Age.Days,
            Hours: record.Age.Hours,
            Minutes: record.Age.Minutes
          },
          Sex: record.Sex,
          Date_Time_Of_Death: record.Date_Time_Of_Death,
          causeOfDeath1: record.causeOfDeath1,
          code1: record.code1,
          causeOfDeathFreeText1: record.causeOfDeathFreeText1,
          Time_Interval_From_Onset_To_Death1: {
            Time_Interval_Unit1: record.Time_Interval_From_Onset_To_Death1.Time_Interval_Unit1,
            Time_Interval_Qtty1: record.Time_Interval_From_Onset_To_Death1.Time_Interval_Qtty1
          },
          causeOfDeath2: record.causeOfDeath2,
          code2: record.code2,
          causeOfDeathFreeText2: record.causeOfDeathFreeText2,
          Time_Interval_From_Onset_To_Death2: {
            Time_Interval_Unit2: record.Time_Interval_From_Onset_To_Death2.Time_Interval_Unit2,
            Time_Interval_Qtty2: record.Time_Interval_From_Onset_To_Death2.Time_Interval_Qtty2
          },
          // Repeat the same pattern for other causeOfDeath properties
          State_Underlying_Cause: record.State_Underlying_Cause,
          State_Underlying_Cause_Code: record.State_Underlying_Cause_Code,
          Doris_Underlying_Cause: record.Doris_Underlying_Cause,
          dorisCode: record.dorisCode,
          Final_Underlying_Cause: record.Final_Underlying_Cause,
          Final_Underlying_CauseCode: record.Final_Underlying_CauseCode,
          lastSurgeryPerformed: record.lastSurgeryPerformed,
          dateOfSurgery: record.dateOfSurgery,
          reasonForSurgery: record.reasonForSurgery,
          autopsyRequested: record.autopsyRequested,
          findingsInCertification: record.findingsInCertification,
          disease: record.disease,
          accident: record.accident,
          intentionalSelfHarm: record.intentionalSelfHarm,
          assault: record.assault,
          legalIntervention: record.legalIntervention,
          war: record.war,
          notDetermined: record.notDetermined,
          pendingInvenstigation: record.pendingInvenstigation,
          unknown: record.unknown,
          externalCause: record.externalCause,
          dateOfInjury: record.dateOfInjury,
          describeExternalCause: record.describeExternalCause,
          occuranceOfExternalCause: record.occuranceOfExternalCause,
          multiplePregnancy: record.multiplePregnancy,
          stillBorn: record.stillBorn,
          numberOfHrsSurvived: record.numberOfHrsSurvived,
          birthWeight: record.birthWeight,
          numberOfCompletedPregWeeks: record.numberOfCompletedPregWeeks,
          ageOfMother: record.ageOfMother,
          conditionsPerinatalDeath: record.conditionsPerinatalDeath,
          wasDeceasedPreg: record.wasDeceasedPreg,
          atWhatPoint: record.atWhatPoint,
          didPregancyContributeToDeath: record.didPregancyContributeToDeath,
          parity: record.parity,
          modeOfDelivery: record.modeOfDelivery,
          placeOfDelivery: record.placeOfDelivery,
          deliveredBySkilledAttendant: record.deliveredBySkilledAttendant,
          I_Attended_Deceased: record.I_Attended_Deceased,
          I_Examined_Body: record.I_Examined_Body,
          I_Conducted_PostMortem: record.I_Conducted_PostMortem,
          Other: record.Other,
          examinedBy: record.examinedBy,
          sentToApi: record.sentToApi,
        }));
      })
      .catch(error => console.error('Error fetching medical certificates:', error));

  }

}
