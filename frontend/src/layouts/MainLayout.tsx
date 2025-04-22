import {
    AppBar,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
  } from '@mui/material'
  
  import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    CheckCircle as CheckCircleIcon,
    AdminPanelSettings as AdminIcon,
    Group as GroupIcon,
    People as PeopleIcon,
    Settings as SettingIcon,
    Logout as LogoutIcon,
  } from '@mui/icons-material'
  
  import { useState } from 'react'
  import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom'
  import { useAuth } from '../hooks/useAuth'
  
  const drawerWidth = 240
  
  export default function MainLayout() {
    const { user, isAdmin, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
  
    const [mobileOpen, setMobileOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)
    const handleLogoutClick = () => {
      setAnchorEl(null)
      setLogoutDialogOpen(true)
    }
  
    const confirmLogout = () => {
      logout()
      setLogoutDialogOpen(false)
    }
  
    const cancelLogout = () => setLogoutDialogOpen(false)
  
    const isActive = (path: string) => location.pathname === path
  
    const drawerItemStyle = (path: string) => ({
      ...(isActive(path) && {
        backgroundColor: 'primary.main',
        color: 'white',
        '& .MuiListItemIcon-root': { color: 'white' },
      }),
    })
  
    const drawer = (
      <>
        <Toolbar />
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/dashboard" sx={drawerItemStyle('/dashboard')}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
  
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/acknowledgements" sx={drawerItemStyle('/acknowledgements')}>
              <ListItemIcon><CheckCircleIcon /></ListItemIcon>
              <ListItemText primary="Aceites" />
            </ListItemButton>
          </ListItem>
  
          {isAdmin && (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/admin" sx={drawerItemStyle('/admin')}>
                  <ListItemIcon><AdminIcon /></ListItemIcon>
                  <ListItemText primary="Painel Admin" />
                </ListItemButton>
              </ListItem>
  
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/admin/users" sx={drawerItemStyle('/admin/users')}>
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Usuários" />
                </ListItemButton>
              </ListItem>
  
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/admin/groups" sx={drawerItemStyle('/admin/groups')}>
                  <ListItemIcon><GroupIcon /></ListItemIcon>
                  <ListItemText primary="Grupos" />
                </ListItemButton>
              </ListItem>
  
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/admin/settings" sx={drawerItemStyle('/admin/settings')}>
                  <ListItemIcon><SettingIcon /></ListItemIcon>
                  <ListItemText primary="Configurações" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
  
        <Divider sx={{ mt: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogoutClick}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </>
    )
  
    return (
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              GreyPolicy
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>{user?.name}</Typography>
              <IconButton onClick={handleMenuOpen}>
                <Avatar>{user?.name?.[0] ?? 'U'}</Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
  
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem disabled>{user?.email}</MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Sair
          </MenuItem>
        </Menu>
  
        <Dialog open={logoutDialogOpen} onClose={cancelLogout}>
          <DialogTitle>Deseja sair?</DialogTitle>
          <DialogContent>
            <DialogContentText>Você será desconectado da sua conta.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelLogout}>Cancelar</Button>
            <Button onClick={confirmLogout} color="error" variant="contained">Sair</Button>
          </DialogActions>
        </Dialog>
  
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {drawer}
        </Drawer>
  
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
  
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    )
  }