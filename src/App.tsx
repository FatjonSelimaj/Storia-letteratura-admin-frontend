import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ArticleList from './components/ArticleList';
import ArticleForm from './form/ArticleForm';
import AuthorList from './components/AuthorList';
import AuthorForm from './form/AuthorForm';
import HistorySectionForm from './form/HistorySectionForm';
import HistorySectionList from './components/HistorySectionList';
import WorkForm from './form/WorkFrom';
import WorkList from './components/WorkList';
import Home from './components/HomePage';  // Importa il componente Home
import AuthorDetails from './components/AuthorDetails';
import LiteratureForm from './form/LiteratureForm';
import LiteratureList from './components/LiteratureList';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto mt-8">
                <Routes>
                    <Route path="/" element={<Home />} />  {/* Aggiunta della HomePage */}
                    <Route path="/articles" element={<ArticleList />} />
                    <Route path="/create-article" element={<ArticleForm />} />
                    <Route path="/edit-article/:id" element={<ArticleForm />} />
                    <Route path="/authors" element={<AuthorList />} />
                    <Route path="/create-author" element={<AuthorForm />} />
                    <Route path="/edit-author/:id" element={<AuthorForm />} />
                    <Route path="/history-sections" element={<HistorySectionList />} />
                    <Route path="/create-history-section" element={<HistorySectionForm />} />
                    <Route path="/history-sections/:id" element={<HistorySectionForm />} />
                    <Route path="/literatures" element={<LiteratureList />} />
                    <Route path="/create-literature" element={<LiteratureForm />} />
                    <Route path="/works" element={<WorkList />} />
                    <Route path="/works/:id" element={<WorkForm />} />
                    <Route path="/works/new" element={<WorkForm />} />
                    <Route path="/author-details/:id" element={<AuthorDetails />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
