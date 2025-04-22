// src/components/PageHeader.tsx
import { Breadcrumbs, Typography, Link as MuiLink } from '@mui/material'
import { Link } from 'react-router-dom'

type PageHeaderProps = {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function PageHeader({ title, breadcrumbs = [] }: PageHeaderProps) {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        {breadcrumbs.map((crumb, index) =>
          crumb.href ? (
            <MuiLink
              key={index}
              component={Link}
              to={crumb.href}
              underline="hover"
              color="inherit"
            >
              {crumb.label}
            </MuiLink>
          ) : (
            <Typography key={index} color="text.primary">
              {crumb.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
    </>
  )
}
