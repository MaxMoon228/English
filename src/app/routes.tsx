import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { MaterialDetailPage } from './pages/MaterialDetailPage';
import { SkillMapPage } from './pages/SkillMapPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminEditorPage } from './pages/AdminEditorPage';
import { AdminMaterialsPage } from './pages/AdminMaterialsPage';
import { AdminTextbooksPage } from './pages/AdminTextbooksPage';
import { AdminSectionsPage } from './pages/AdminSectionsPage';
import { AdminTagsPage } from './pages/AdminTagsPage';
import { AdminHistoryPage } from './pages/AdminHistoryPage';
import { AdminUploadsPage } from './pages/AdminUploadsPage';
import { RequireAuth } from './features/auth/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'catalog', Component: CatalogPage },
      { path: 'catalog/:section', Component: CatalogPage },
      { path: 'catalog/:section/:subsection', Component: CatalogPage },
      { path: 'material/:id', Component: MaterialDetailPage },
      { path: 'skill-map', Component: SkillMapPage },
    ],
  },
  { path: '/admin/login', Component: AdminLoginPage },
  { path: '/admin', Component: () => <RequireAuth><AdminDashboardPage /></RequireAuth> },
  { path: '/admin/materials', Component: () => <RequireAuth><AdminMaterialsPage /></RequireAuth> },
  { path: '/admin/materials/new', Component: () => <RequireAuth><AdminEditorPage /></RequireAuth> },
  { path: '/admin/materials/:id/edit', Component: () => <RequireAuth><AdminEditorPage /></RequireAuth> },
  { path: '/admin/textbooks', Component: () => <RequireAuth><AdminTextbooksPage /></RequireAuth> },
  { path: '/admin/sections', Component: () => <RequireAuth><AdminSectionsPage /></RequireAuth> },
  { path: '/admin/tags', Component: () => <RequireAuth><AdminTagsPage /></RequireAuth> },
  { path: '/admin/history', Component: () => <RequireAuth><AdminHistoryPage /></RequireAuth> },
  { path: '/admin/uploads', Component: () => <RequireAuth><AdminUploadsPage /></RequireAuth> },
  { path: '/admin/editor/:id', Component: () => <RequireAuth><AdminEditorPage /></RequireAuth> },
]);
