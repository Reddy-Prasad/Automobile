<script setup>
import { PERMISSIONS, ROLE_LABELS, ROLE_PERMISSIONS, ROLES } from '@/data/roles'

const permissionList = Object.values(PERMISSIONS)
</script>

<template>
  <div>
    <h1 class="h3 fw-bold mb-2">Roles</h1>
    <p class="text-body-secondary">
      A role is a job title. A permission is the switch a button and the mock API both check.
    </p>
    <div class="table-responsive card border-0 shadow-sm">
      <table class="table align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Permission</th>
            <th v-for="role in Object.values(ROLES)" :key="role">{{ ROLE_LABELS[role] }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="permission in permissionList" :key="permission">
            <td><code>{{ permission }}</code></td>
            <td v-for="role in Object.values(ROLES)" :key="role">
              {{
                ROLE_PERMISSIONS[role].includes('*') || ROLE_PERMISSIONS[role].includes(permission)
                  ? 'Yes'
                  : '—'
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
