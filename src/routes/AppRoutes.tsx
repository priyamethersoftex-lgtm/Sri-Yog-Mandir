import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';

import RoomsList from '../pages/Rooms/RoomsList';
import NewRoom from '../pages/Rooms/NewRoom';
import RoomEdit from '../pages/Rooms/RoomEdit';
import RoomTypes from '../pages/Rooms/RoomTypes';
import RoomViews from '../pages/Rooms/RoomViews';
import BedTypes from '../pages/Rooms/BedTypes';
import ReservationsList from '../pages/Reservations/ReservationsList';
import NewReservation from '../pages/Reservations/NewReservation';
import ReservationDetails from '../pages/Reservations/ReservationDetails';
import GalleryList from '../pages/Gallery/GalleryList';
import Banners from '../pages/Banners/Banners';

import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Settings/Profile';
import Administrator from '../pages/Settings/Administrator';
import Contact from '../pages/Settings/Contact';
import Amenities from '../pages/Settings/Amenities';

const NotFound = () => <div className="p-8 text-center"><h2 className="text-2xl font-bold">404 - Not Found</h2></div>;

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/reservations" element={<ReservationsList />} />
          <Route path="/reservations/new" element={<NewReservation />} />
          <Route path="/reservations/:id" element={<ReservationDetails />} />
          
          <Route path="/rooms" element={<RoomsList />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/types" element={<RoomTypes />} />
          <Route path="/rooms/views" element={<RoomViews />} />
          <Route path="/rooms/beds" element={<BedTypes />} />
          <Route path="/rooms/:id/edit" element={<RoomEdit />} />
          
          <Route path="/gallery" element={<GalleryList />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings/administrator" element={<Administrator />} />
          <Route path="/settings/enquiry" element={<Contact />} />
          <Route path="/settings/amenities" element={<Amenities />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

