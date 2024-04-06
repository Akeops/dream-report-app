# Dream Management App

This Dream Management App is built using React Native and Expo, with TypeScript as its foundation. It's designed to provide a robust platform for users to log and analyze their dreams. The development environment leverages the power of Expo for real-time updates and Android Studio's emulator for comprehensive testing across a wide range of devices.

## Getting Started

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**

    ```bash
    git clone https://github.com/Akeops/dream-report-app.git
    ```

2. **Install Dependencies**

    Navigate to the project directory and run:

    ```bash
    npm install
    ```

3. **Start the Project**

    Launch the app with Expo:

    ```bash
    npx expo start
    ```

## API Integration

The app utilizes the MeaningCloud Topics 2.0 API for dream analysis. To access this feature, you'll need an API key:

- Sign up at [MeaningCloud's Developer Portal](https://www.meaningcloud.com/developer/create-account) to obtain your API key.
- Find your API key under your account subscriptions at `https://www.meaningcloud.com/developer/account/subscriptions`.

## Features

- **Dream Logging**: Users can enter details of their dreams through a form, specifying a title, text, and categorizing the dream as either lucid or a nightmare.
- **Dream Categorization**: Stored dreams are displayed in a list, with colors indicating their categories for easy identification.
- **Colorblind Mode**: Enhance accessibility with a toggle that adjusts the colors of the dream list, catering to colorblind users.
- **Search Functionality**: Allows users to search for dreams by title.
- **Dream Deletion**: Users have the option to remove dreams from their list.
- **Analysis**: The app's third tab offers functionality to analyze the latest dream stored in AsyncStorage via the MeaningCloud API.

## Data Storage

The app employs AsyncStorage for local data storage on the device, ensuring user data privacy and security.

## Screenshots

Below are screenshots depicting the app's UI:

![Screenshot 1](<screenshot-link>)
![Screenshot 2](<screenshot-link>)
![Screenshot 3](<screenshot-link>)

*Note: Replace `<screenshot-link>` with actual URLs to your screenshots.*
