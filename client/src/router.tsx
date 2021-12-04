import React from 'react';
import {
    BrowserRouter, Switch,
    Route,
    Redirect
} from 'react-router-dom';

import { AppLayout } from './common/layout';
import { Home } from './pages/Home';
import { About } from './pages/About';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <AppLayout>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Redirect to="/" />
                </Switch>
            </AppLayout>
        </BrowserRouter>
    )
}