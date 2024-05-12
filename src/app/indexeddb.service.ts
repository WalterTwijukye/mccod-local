// indexeddb.service.ts
import { Injectable } from '@angular/core';
// import * as CryptoJS from 'crypto-js'; 

@Injectable({
  providedIn: 'root'
})

export class IndexeddbService {
  private dbName = 'MedicalCertificateOfCauseOfDeath';
  private dbVersion = 3;
  private indexedDB: IDBFactory;
  // private secretKey!: string;

  constructor() {
    // Type assertion to let TypeScript know that indexedDB exists on the Window object
    this.indexedDB = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB;
    
    if (!this.indexedDB) {
      throw new Error('IndexedDB is not supported in this browser');
    }

    // Generate a random secret key
    // this.secretKey = this.generateSecretKey();
  }

  // private generateSecretKey(): string {
  //   // Generate a random key with 16 bytes (128 bits)
  //   const key = CryptoJS.lib.WordArray.random(16);
  //   // Convert the key to a Base64 string
  //   const base64Key = CryptoJS.enc.Base64.stringify(key);
  //   return base64Key;
  // }

  // private encryptData(data: any): string {
  //   const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  //   return encryptedData;
  // }

  // private decryptData(encryptedData: string): any {
  //   const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
  //   return JSON.parse(decryptedData);
  // }
  
  openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject('Error opening database');
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;

        if (!db.objectStoreNames.contains('medicalCertificates')) {
          db.createObjectStore('medicalCertificates', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });          
        }

        if (!db.objectStoreNames.contains('events')) {
          db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  addMedicalCertificate(data: any): Promise<any> {
    // const encryptedData = this.encryptData(data);
    
    return this.openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['medicalCertificates'], 'readwrite');
        const objectStore = transaction.objectStore('medicalCertificates');
        const request = objectStore.add(data);

        request.onsuccess = () => {
          const savedObject = { ...data, id: request.result }; // Include the generated ID in the saved object
          resolve({ message: 'Record successfully saved', data: savedObject });
        };
        request.onerror = () => reject('Error adding medical certificate');
      });
    });
  }

  addUser(data: any): Promise<any> {
    return this.openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readwrite');
        // transaction.onerror = () => reject('Transaction error');
        const objectStore = transaction.objectStore('users');
        const request = objectStore.add(data);
  
        request.onsuccess = () => {
          const savedObject = { ...data, id: request.result }; // Include the generated ID in the saved object
          resolve({ message: 'User successfully added', data: savedObject });
        };
        request.onerror = () => reject('Error adding user');
      });
    });
  }
  

  getUserByUsername(username: string): Promise<any> {
    return this.openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const index = objectStore.index('username');
        const request = index.get(username);

        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => reject('Error fetching user by username');
      });
    });
  }

  // Methods handling events from online source

  getEventById(eventId: string | null | undefined): Promise<any> {
    if (!eventId) {
      return Promise.reject('Invalid eventId');
    }
  
    return this.openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['events'], 'readonly');
        const objectStore = transaction.objectStore('events');
        const request = objectStore.get(eventId);
  
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => reject('Error fetching event by ID');
      });
    });
  }
  

  addEvent(event: any): Promise<any> {
    return this.openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['events'], 'readwrite');
        const objectStore = transaction.objectStore('events');
        const request = objectStore.add(event);

        request.onsuccess = () => {
          const savedEvent = { ...event, id: request.result }; // Include the generated ID in the saved object
          resolve(savedEvent);
        };
        request.onerror = () => reject('Error adding event');
      });
    });
  }

  getAllUnsentRecords(): Promise<any[]> {
    return this.openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['medicalCertificates'], 'readonly');
        const objectStore = transaction.objectStore('medicalCertificates');
        const request = objectStore.getAll();

        request.onsuccess = () => {
          const unsentRecords = request.result.filter(record => record.sentToApi !== 'true');
          resolve(unsentRecords);
        };

        request.onerror = () => reject('Error fetching unsent records');
      });
    });
  }

  sentToAPI(recordId: number, value: string): Promise<any> {
    return this.openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['medicalCertificates'], 'readwrite');
        const objectStore = transaction.objectStore('medicalCertificates');
        const request = objectStore.get(recordId);
  
        request.onsuccess = () => {
          const record = request.result;
          if (!record) {
            reject(`Record with ID ${recordId} not found`);
            return;
          }
  
          record.sentToApi = value;
          const updateRequest = objectStore.put(record);
  
          updateRequest.onsuccess = () => {
            resolve({ message: 'Field updated successfully', data: record });
          };
  
          updateRequest.onerror = () => reject('Error updating field');
        };
  
        request.onerror = () => reject('Error fetching record for update');
      });
    });
  }

  // Method to get all medical certificates
  getAllMedicalCertificates(): Promise<any[]> {
    return this.openDatabase().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['medicalCertificates'], 'readonly');
        const objectStore = transaction.objectStore('medicalCertificates');
        const request = objectStore.getAll();
        request.onsuccess = () => {
          // Decrypt all retrieved data before returning
          // const decryptedData = request.result.map(record => this.decryptData(record));
          // resolve(decryptedData);
          // console.log(decryptedData);

           resolve(request.result);
        };
        request.onerror = () => {
          reject('Error fetching all medical certificates');
        };
      });
    });
  }

// Method to get all medical certificates where sentToApi is true
getAllSentToApiTrue(): Promise<any[]> {
  return this.openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['medicalCertificates'], 'readonly');
      const objectStore = transaction.objectStore('medicalCertificates');
      const index = objectStore.index('sentToApi');
      const request = index.getAll('true');
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject('Error fetching medical certificates where sentToApi is true');
      };
    });
  });
}

// Method to get all medical certificates where sentToApi is false
getAllSentToApiFalse(): Promise<any[]> {
  return this.openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['medicalCertificates'], 'readonly');
      const objectStore = transaction.objectStore('medicalCertificates');
      const index = objectStore.index('sentToApi');
      const request = index.getAll('false');
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject('Error fetching medical certificates where sentToApi is false');
      };
    });
  });
}

getMedicalCertificateById(id: number): Promise<any> {
  return this.openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['medicalCertificates'], 'readonly');
      const objectStore = transaction.objectStore('medicalCertificates');
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => reject(`Error fetching medical certificate with ID ${id}`);
    });
  });
}

editMedicalCertificate(id: number, newData: any): Promise<any> {
  return this.openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['medicalCertificates'], 'readwrite');
      const objectStore = transaction.objectStore('medicalCertificates');
      const request = objectStore.get(id);

      request.onsuccess = () => {
        const record = request.result;
        if (!record) {
          reject(`Record with ID ${id} not found`);
          return;
        }

        // Create a copy of the record
        const updatedRecord = { ...record };

        // Replace specific properties with values from newData
        updatedRecord.facility = newData.facility !== undefined ? newData.facility : updatedRecord.facility;
        updatedRecord.eventId = newData.eventId !== undefined ? newData.eventId : updatedRecord.eventId;
        updatedRecord.MOH_National_Case_Number = newData.MOH_National_Case_Number !== undefined ? newData.MOH_National_Case_Number : updatedRecord.MOH_National_Case_Number;
        updatedRecord.NIN = newData.NIN !== undefined ? newData.NIN : updatedRecord.NIN;
        updatedRecord.Inpatient_Number = newData.Inpatient_Number !== undefined ? newData.Inpatient_Number : updatedRecord.Inpatient_Number;
        updatedRecord.Name = newData.Name !== undefined ? newData.Name : updatedRecord.Name;
        updatedRecord.Region = newData.Region !== undefined ? newData.Region : updatedRecord.Region;
        updatedRecord.District = newData.District !== undefined ? newData.District : updatedRecord.District;
        updatedRecord.County = newData.County !== undefined ? newData.County : updatedRecord.County;
        updatedRecord.Sub_County = newData.Sub_County !== undefined ? newData.Sub_County : updatedRecord.Sub_County;
        updatedRecord.Village = newData.Village !== undefined ? newData.Village : updatedRecord.Village;
        updatedRecord.placeOfDeath = newData.placeOfDeath !== undefined ? newData.placeOfDeath : updatedRecord.placeOfDeath;
        updatedRecord.Occupation = newData.Occupation !== undefined ? newData.Occupation : updatedRecord.Occupation;
        updatedRecord.Date_Of_Birth_Known = newData.Date_Of_Birth_Known !== undefined ? newData.Date_Of_Birth_Known : updatedRecord.Date_Of_Birth_Known;
        updatedRecord.Date_Of_Birth_notKnown = newData.Date_Of_Birth_notKnown !== undefined ? newData.Date_Of_Birth_notKnown : updatedRecord.Date_Of_Birth_notKnown;
        updatedRecord.Date_Of_Birth = newData.Date_Of_Birth !== undefined ? newData.Date_Of_Birth : updatedRecord.Date_Of_Birth;
        updatedRecord.Age = newData.Age !== undefined ? newData.Age : updatedRecord.Age;
        updatedRecord.Sex = newData.Sex !== undefined ? newData.Sex : updatedRecord.Sex;
        updatedRecord.Date_Time_Of_Death = newData.Date_Time_Of_Death !== undefined ? newData.Date_Time_Of_Death : updatedRecord.Date_Time_Of_Death;
        updatedRecord.causeOfDeath1 = newData.causeOfDeath1 !== undefined ? newData.causeOfDeath1 : updatedRecord.causeOfDeath1;
        updatedRecord.code1 = newData.code1 !== undefined ? newData.code1 : updatedRecord.code1;
        updatedRecord.causeOfDeathFreeText1 = newData.causeOfDeathFreeText1 !== undefined ? newData.causeOfDeathFreeText1 : updatedRecord.causeOfDeathFreeText1;
        updatedRecord.Time_Interval_From_Onset_To_Death1 = newData.Time_Interval_From_Onset_To_Death1 !== undefined ? newData.Time_Interval_From_Onset_To_Death1 : updatedRecord.Time_Interval_From_Onset_To_Death1;
        updatedRecord.causeOfDeath2 = newData.causeOfDeath2 !== undefined ? newData.causeOfDeath2 : updatedRecord.causeOfDeath2;
        updatedRecord.code2 = newData.code2 !== undefined ? newData.code2 : updatedRecord.code2;
        updatedRecord.causeOfDeathFreeText2 = newData.causeOfDeathFreeText2 !== undefined ? newData.causeOfDeathFreeText2 : updatedRecord.causeOfDeathFreeText2;
        updatedRecord.Time_Interval_From_Onset_To_Death2 = newData.Time_Interval_From_Onset_To_Death2 !== undefined ? newData.Time_Interval_From_Onset_To_Death2 : updatedRecord.Time_Interval_From_Onset_To_Death2;
        updatedRecord.causeOfDeath3 = newData.causeOfDeath3 !== undefined ? newData.causeOfDeath3 : updatedRecord.causeOfDeath3;
        updatedRecord.code3 = newData.code3 !== undefined ? newData.code3 : updatedRecord.code3;
        updatedRecord.causeOfDeathFreeText3 = newData.causeOfDeathFreeText3 !== undefined ? newData.causeOfDeathFreeText3 : updatedRecord.causeOfDeathFreeText3;
        updatedRecord.Time_Interval_From_Onset_To_Death3 = newData.Time_Interval_From_Onset_To_Death3 !== undefined ? newData.Time_Interval_From_Onset_To_Death3 : updatedRecord.Time_Interval_From_Onset_To_Death3;
        updatedRecord.causeOfDeath4 = newData.causeOfDeath4 !== undefined ? newData.causeOfDeath4 : updatedRecord.causeOfDeath4;
        updatedRecord.code4 = newData.code4 !== undefined ? newData.code4 : updatedRecord.code4;
        updatedRecord.causeOfDeathFreeText4 = newData.causeOfDeathFreeText4 !== undefined ? newData.causeOfDeathFreeText4 : updatedRecord.causeOfDeathFreeText4;
        updatedRecord.Time_Interval_From_Onset_To_Death4 = newData.Time_Interval_From_Onset_To_Death4 !== undefined ? newData.Time_Interval_From_Onset_To_Death4 : updatedRecord.Time_Interval_From_Onset_To_Death4;
        updatedRecord.causeOfDeath5 = newData.causeOfDeath5 !== undefined ? newData.causeOfDeath5 : updatedRecord.causeOfDeath5;
        updatedRecord.code5 = newData.code5 !== undefined ? newData.code5 : updatedRecord.code5;
        updatedRecord.causeOfDeathFreeText5 = newData.causeOfDeathFreeText5 !== undefined ? newData.causeOfDeathFreeText5 : updatedRecord.causeOfDeathFreeText5;
        updatedRecord.causeOfDeath6 = newData.causeOfDeath6 !== undefined ? newData.causeOfDeath6 : updatedRecord.causeOfDeath6;
        updatedRecord.code6 = newData.code6 !== undefined ? newData.code6 : updatedRecord.code6;
        updatedRecord.causeOfDeathFreeText6 = newData.causeOfDeathFreeText6 !== undefined ? newData.causeOfDeathFreeText6 : updatedRecord.causeOfDeathFreeText6;
        updatedRecord.causeOfDeath7 = newData.causeOfDeath7 !== undefined ? newData.causeOfDeath7 : updatedRecord.causeOfDeath7;
        updatedRecord.code7 = newData.code7 !== undefined ? newData.code7 : updatedRecord.code7;
        updatedRecord.causeOfDeathFreeText7 = newData.causeOfDeathFreeText7 !== undefined ? newData.causeOfDeathFreeText7 : updatedRecord.causeOfDeathFreeText7;
        updatedRecord.causeOfDeath8 = newData.causeOfDeath8 !== undefined ? newData.causeOfDeath8 : updatedRecord.causeOfDeath8;
        updatedRecord.code8 = newData.code8 !== undefined ? newData.code8 : updatedRecord.code8;
        updatedRecord.causeOfDeathFreeText8 = newData.causeOfDeathFreeText8 !== undefined ? newData.causeOfDeathFreeText8 : updatedRecord.causeOfDeathFreeText8;
        updatedRecord.causeOfDeath9 = newData.causeOfDeath9 !== undefined ? newData.causeOfDeath9 : updatedRecord.causeOfDeath9;
        updatedRecord.code9 = newData.code9 !== undefined ? newData.code9 : updatedRecord.code9;
        updatedRecord.causeOfDeathFreeText9 = newData.causeOfDeathFreeText9 !== undefined ? newData.causeOfDeathFreeText9 : updatedRecord.causeOfDeathFreeText9;
        updatedRecord.State_Underlying_Cause = newData.State_Underlying_Cause !== undefined ? newData.State_Underlying_Cause : updatedRecord.State_Underlying_Cause;
        updatedRecord.State_Underlying_Cause_Code = newData.State_Underlying_Cause_Code !== undefined ? newData.State_Underlying_Cause_Code : updatedRecord.State_Underlying_Cause_Code;
        updatedRecord.Doris_Underlying_Cause = newData.Doris_Underlying_Cause !== undefined ? newData.Doris_Underlying_Cause : updatedRecord.Doris_Underlying_Cause;
        updatedRecord.dorisCode = newData.dorisCode !== undefined ? newData.dorisCode : updatedRecord.dorisCode;
        updatedRecord.Final_Underlying_Cause = newData.Final_Underlying_Cause !== undefined ? newData.Final_Underlying_Cause : updatedRecord.Final_Underlying_Cause;
        updatedRecord.Final_Underlying_CauseCode = newData.Final_Underlying_CauseCode !== undefined ? newData.Final_Underlying_CauseCode : updatedRecord.Final_Underlying_CauseCode;
        updatedRecord.lastSurgeryPerformed = newData.lastSurgeryPerformed !== undefined ? newData.lastSurgeryPerformed : updatedRecord.lastSurgeryPerformed;
        updatedRecord.dateOfSurgery = newData.dateOfSurgery !== undefined ? newData.dateOfSurgery : updatedRecord.dateOfSurgery;
        updatedRecord.reasonForSurgery = newData.reasonForSurgery !== undefined ? newData.reasonForSurgery : updatedRecord.reasonForSurgery;
        updatedRecord.autopsyRequested = newData.autopsyRequested !== undefined ? newData.autopsyRequested : updatedRecord.autopsyRequested;
        updatedRecord.findingsInCertification = newData.findingsInCertification !== undefined ? newData.findingsInCertification : updatedRecord.findingsInCertification;
        updatedRecord.disease = newData.disease !== undefined ? newData.disease : updatedRecord.disease;
        updatedRecord.accident = newData.accident !== undefined ? newData.accident : updatedRecord.accident;
        updatedRecord.intentionalSelfHarm = newData.intentionalSelfHarm !== undefined ? newData.intentionalSelfHarm : updatedRecord.intentionalSelfHarm;
        updatedRecord.assault = newData.assault !== undefined ? newData.assault : updatedRecord.assault;
        updatedRecord.legalIntervention = newData.legalIntervention !== undefined ? newData.legalIntervention : updatedRecord.legalIntervention;
        updatedRecord.war = newData.war !== undefined ? newData.war : updatedRecord.war;
        updatedRecord.notDetermined = newData.notDetermined !== undefined ? newData.notDetermined : updatedRecord.notDetermined;
        updatedRecord.pendingInvenstigation = newData.pendingInvenstigation !== undefined ? newData.pendingInvenstigation : updatedRecord.pendingInvenstigation;
        updatedRecord.unknown = newData.unknown !== undefined ? newData.unknown : updatedRecord.unknown;
        updatedRecord.externalCause = newData.externalCause !== undefined ? newData.externalCause : updatedRecord.externalCause;
        updatedRecord.dateOfInjury = newData.dateOfInjury !== undefined ? newData.dateOfInjury : updatedRecord.dateOfInjury;
        updatedRecord.describeExternalCause = newData.describeExternalCause !== undefined ? newData.describeExternalCause : updatedRecord.describeExternalCause;
        updatedRecord.occuranceOfExternalCause = newData.occuranceOfExternalCause !== undefined ? newData.occuranceOfExternalCause : updatedRecord.occuranceOfExternalCause;
        updatedRecord.multiplePregnancy = newData.multiplePregnancy !== undefined ? newData.multiplePregnancy : updatedRecord.multiplePregnancy;
        updatedRecord.stillBorn = newData.stillBorn !== undefined ? newData.stillBorn : updatedRecord.stillBorn;
        updatedRecord.numberOfHrsSurvived = newData.numberOfHrsSurvived !== undefined ? newData.numberOfHrsSurvived : updatedRecord.numberOfHrsSurvived;
        updatedRecord.birthWeight = newData.birthWeight !== undefined ? newData.birthWeight : updatedRecord.birthWeight;
        updatedRecord.numberOfCompletedPregWeeks = newData.numberOfCompletedPregWeeks !== undefined ? newData.numberOfCompletedPregWeeks : updatedRecord.numberOfCompletedPregWeeks;
        updatedRecord.ageOfMother = newData.ageOfMother !== undefined ? newData.ageOfMother : updatedRecord.ageOfMother;
        updatedRecord.conditionsPerinatalDeath = newData.conditionsPerinatalDeath !== undefined ? newData.conditionsPerinatalDeath : updatedRecord.conditionsPerinatalDeath;
        updatedRecord.wasDeceasedPreg = newData.wasDeceasedPreg !== undefined ? newData.wasDeceasedPreg : updatedRecord.wasDeceasedPreg;
        updatedRecord.atWhatPoint = newData.atWhatPoint !== undefined ? newData.atWhatPoint : updatedRecord.atWhatPoint;
        updatedRecord.didPregancyContributeToDeath = newData.didPregancyContributeToDeath !== undefined ? newData.didPregancyContributeToDeath : updatedRecord.didPregancyContributeToDeath;
        updatedRecord.parity = newData.parity !== undefined ? newData.parity : updatedRecord.parity;
        updatedRecord.modeOfDelivery = newData.modeOfDelivery !== undefined ? newData.modeOfDelivery : updatedRecord.modeOfDelivery;
        updatedRecord.placeOfDelivery = newData.placeOfDelivery !== undefined ? newData.placeOfDelivery : updatedRecord.placeOfDelivery;
        updatedRecord.deliveredBySkilledAttendant = newData.deliveredBySkilledAttendant !== undefined ? newData.deliveredBySkilledAttendant : updatedRecord.deliveredBySkilledAttendant;
        updatedRecord.I_Attended_Deceased = newData.I_Attended_Deceased !== undefined ? newData.I_Attended_Deceased : updatedRecord.I_Attended_Deceased;
        updatedRecord.I_Examined_Body = newData.I_Examined_Body !== undefined ? newData.I_Examined_Body : updatedRecord.I_Examined_Body;
        updatedRecord.I_Conducted_PostMortem = newData.I_Conducted_PostMortem !== undefined ? newData.I_Conducted_PostMortem : updatedRecord.I_Conducted_PostMortem;
        updatedRecord.Other = newData.Other !== undefined ? newData.Other : updatedRecord.Other;
        updatedRecord.examinedBy = newData.examinedBy !== undefined ? newData.examinedBy : updatedRecord.examinedBy;
        updatedRecord.sentToApi = newData.sentToApi !== undefined ? newData.sentToApi : updatedRecord.sentToApi;

        // Put the updated record back into the object store
        const updateRequest = objectStore.put(updatedRecord);

        updateRequest.onsuccess = () => {
          resolve({ message: 'Record updated successfully', data: updatedRecord });
        };

        updateRequest.onerror = () => reject('Error updating record');
      };

      request.onerror = () => reject('Error fetching record for update');
    });
  });
}


deleteMedicalCertificate(id: number): Promise<void> {
  return this.openDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['medicalCertificates'], 'readwrite');
      const objectStore = transaction.objectStore('medicalCertificates');
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => reject(`Error deleting record with ID ${id}`);
    });
  });
}  
  
}

