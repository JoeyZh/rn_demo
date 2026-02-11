# MedScheduler - React Native Demo Project


## 📱 Overview

MedScheduler is a medical appointment management application built with React Native. It enables users to view doctor information, book time slots, and manage their appointment list. This project demonstrates core functionalities such as handling time zone differences, time calculations, and state persistence in cross-platform mobile applications, adopting the Domain-Driven Design (DDD) pattern.

https://github.com/user-attachments/assets/58b6f279-aaa6-41c8-bf49-4ca67833b320

![demo video](https://github.com/user-attachments/assets/58b6f279-aaa6-41c8-bf49-4ca67833b320)




## ⚙️ Setup & Usage Instructions


### Prerequisites


Ensure you have the following tools installed:


- Node.js (v16 or higher, v22.14.0 used by the author)
- npm, yarn, or pnpm
- React Native CLI or Expo CLI
- Android Studio / Xcode (for emulators)


### Installation


1. Clone the repository:


   ```bash
   git clone https://github.com/your-repo/MedScheduler.git
   cd MedScheduler
   ```


2. Install dependencies:


   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```


3. Start the development server:


   ```bash
   # Run on Android device/emulator
   pnpm run android
   ```


4. Open the app on an emulator or physical device.


---


### Usage Guide


1. **Home Page**: Displays a weekly list of doctors. Selecting a date filters doctors available on that day (time zone agnostic, displayed based on the user's device time zone).
2. **Appointment Page**: Submit appointment requests after selecting a doctor and time slot.
3. **My Appointments**: View booked time slots and cancel non-expired appointments.
4. **Time Zone Handling**: Automatically converts times between the doctor's time zone and the user's local time zone.
5. **Data Persistence**: Uses AsyncStorage to store doctor lists and appointment records, preventing data loss on app restart (offline mode supported).


---


## 🧠 Assumptions & Design Decisions


### Key Assumptions


1. **Time Zone Handling**:
   - User devices use the local time zone by default (e.g., Beijing Time UTC+8).
   - Doctor information includes their time zone (e.g., UTC-5).
   - When booking appointments, time comparisons (timestamp/UTC time) are required between the doctor's time zone and the user's device time zone. Appointments are only available for slots 30 minutes ahead of the current time (expired slots are view-only).
   - For appointment time slots in [Doctor Profiles], calculate the time difference between the device time zone and the doctor's time zone, then save the appointment time as a timestamp (UTC time) in the doctor's time zone. For example: Australia/Sydney (UTC+11) is 3 hours ahead of Beijing Time (UTC+8) – a doctor's 8:00 AM slot equals 5:00 AM Beijing Time, so the stored appointment time should subtract 3 hours.
   - In [My Appointments], check if appointments are expired using UTC timestamps: cancellations are allowed if the booked UTC time is later than the current UTC time; expired appointments cannot be cancelled.


2. **Time Comparison Logic**:
   - Appointment times must be later than the current time.
   - Expired appointments cannot be cancelled.
   - Refer to time zone conversion methods in [utils/bookUtils.ts](./utils/bookUtils.ts) for implementation details.


3. **State Management**:
   - Redux Toolkit manages global state (e.g., doctor list, appointment records).
   - AsyncStorage persists appointment data and doctor lists to prevent data loss on app restart.


4. **Navigation Design**:
   - React Navigation implements page navigation.
   - Clear page stack structure supporting back navigation and redirection.


---


### Design Decisions


| Decision Point | Solution | Rationale |
|----------------|----------|-----------|
| State Management | Redux Toolkit | Supports complex state logic, easy to debug and extend |
| Data Persistence | AsyncStorage | Lightweight storage solution suitable for mobile devices |
| Time Handling | UTC + Timestamp | Avoids time zone confusion and ensures accuracy |
| UI Component Library | Custom Components | Flexible adaptation to design requirements |
| Unit Testing | Jest | Used for testing store and utility functions |


---


## 🛠 Known Limitations & Future Enhancements


### Current Limitations


1. **Mocked Network Requests**:
   - Only doctor data is fetched from a test API; other operations use local storage to simulate backend interactions.
   - Recommended integration with RESTful API or GraphQL in future iterations.


2. **Missing Internationalization Support**:
   - Only English UI is supported, with potential translation issues.
   - Extensible to multi-language support (e.g., Chinese).


3. **Incomplete Error Handling**:
   - Basic error handling for edge cases (e.g., network interruptions, invalid data formats) due to time constraints (demo version only includes basic prompts).
   - User feedback (Toast/Modal) needs improvement.
   - Time zone handling (conversion, offset calculation) may contain bugs due to limited testing time.
   
4. **UI Limitations**:
   - Simple interface design with incomplete dark mode support.


### Future Enhancements


1. **Offline Mode Support**:
   - Leverage AsyncStorage to store local data (doctor lists, appointment records) and support offline operations.


---


## 🧪 Testing


### Test Coverage
Refer to test files in the __tests__ directory, including tests for hooks and utility functions (implemented with AI-assisted coding).


### Test Execution Results
- Number of test suites: 12
- Number of test cases executed: 213
- Test results: All passed (213/213)

---

File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                            
--------------------------|---------|----------|---------|---------|----------------------------------------------
All files                 |   93.56 |    84.04 |    91.2 |   93.48 |                                              
 appointments/hooks       |   81.48 |    33.33 |      50 |    87.5 |                                              
  useAppointment.ts       |   81.48 |    33.33 |      50 |    87.5 | 12,17-25                                     
 doctors/hooks            |   98.48 |      100 |   92.85 |     100 |                                              
  useBook.ts              |   93.75 |      100 |      75 |     100 |                                              
  useCalendar.ts          |     100 |      100 |     100 |     100 |                                              
  useDoctorList.ts        |     100 |      100 |     100 |     100 |                                              
 profiles/hooks           |   96.55 |    88.23 |   89.47 |   95.91 |                                              
  useBookAlert.tsx        |     100 |      100 |     100 |     100 |                                              
  useTimeSlot.ts          |   96.15 |    88.23 |   88.23 |   95.45 | 51-52                                        
 store                    |   87.76 |       72 |   96.15 |   86.29 |                                              
  bookAsyncStorages.ts    |   73.43 |       50 |   88.88 |   69.09 | 19,28-38,68-69,83-84,101-102,120-121,133-134 
  doctorSlice.ts          |     100 |      100 |     100 |     100 |                                              
  doctorsAsyncStorages.ts |     100 |      100 |     100 |     100 |                                              
 utils                    |   97.51 |    90.69 |     100 |   97.16 |                                              
  bookUtils.ts            |   96.87 |     87.5 |     100 |   96.47 | 34,88,179                                    
  utils.ts                |   98.46 |    92.59 |     100 |   98.21 | 73                                           


This project includes the following types of automated tests:


#### 1. Edge Cases
- Test extreme input values (e.g., invalid timestamps, empty arrays).
- Validate behavior under boundary conditions (e.g., appointments at the exact current time).


#### 2. Negative Cases
- Simulate failed network requests and empty view displays.
- Test invalid operations (e.g., attempting to cancel expired appointments).


#### 3. Happy Path
- Functional tests for normal workflows (e.g., successful booking, valid cancellation).


### Running Tests


```bash
# Run all tests
npm test


# View test coverage
npx jest --coverage


# Run specific test file
npm test -- __tests__/utils/bookUtils.test.ts
```


### Example Test Case


```ts
describe('Appointment Cancellation', () => {
  it('should prevent cancellation of expired appointments', () => {
    const expiredAppointment = {
      date: new Date(Date.now() - 86400000), // Yesterday
      time: '10:00',
      isBooked: true,
    };


    expect(canCancelAppointment(expiredAppointment)).toBe(false);
  });
});
```


---


## 📦 Technical Stack


| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | ≥ 0.70 | Core framework |
| Expo | Latest | Development environment |
| React Navigation | v6 | Page navigation |
| Redux Toolkit | Latest | State management |
| AsyncStorage | Latest | Data persistence |
| TypeScript | Latest | Type safety |
| Jest | Latest | Unit testing |


---


## ✅ License


MIT License. See [LICENSE](./LICENSE) for details.


---


If you have any questions or improvement suggestions, feel free to contact me!  
Email: joeyzhyee@gmail.com  
Telegram: @joey_flutter_rn_fullstack
