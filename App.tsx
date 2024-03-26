import React from 'react';
import { DreamsProvider } from './context/DreamContext';
import DreamForm from './components/DreamForm';
import DreamList from './components/DreamList';

export default function App() {
    return (
        <DreamsProvider>
            <DreamForm />
            <DreamList />
        </DreamsProvider>
    );
}