<template>
  <div class="admin-container">
    <h1>Admin Dashboard</h1>

    <section aria-label="Users management">
      <h2>Users</h2>

      <!-- Search by email -->
      <label for="searchEmail">Search by email</label>
      <input
        id="searchEmail"
        type="search"
        v-model.trim="searchEmail"
        placeholder="Enter email…" 
        aria-label="Search users by email"
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th @click="toggleSort('epasts')" role="button" tabindex="0">
              Email
              <span v-if="sortKey === 'epasts'">
                {{ sortOrders.epasts > 0 ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="toggleSort('vards')" role="button" tabindex="0">
              Name
              <span v-if="sortKey === 'vards'">
                {{ sortOrders.vards > 0 ? '▲' : '▼' }}
              </span>
            </th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredAndSortedUsers" :key="user.idlietotajs">
            <td>{{ user.idlietotajs }}</td>
            <td>{{ user.epasts }}</td>
            <td>{{ user.vards }}</td>
            <td>{{ user.idlomas === 2 ? 'Administrator' : 'User' }}</td>
            <td>
              <button class="action-button edit-button" @click="editUser(user)">Edit</button>
              <button class="action-button delete-button" @click="deleteUser(user)">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredAndSortedUsers.length === 0">
            <td colspan="5">No users found</td>
          </tr>
        </tbody>
      </table>

      <!-- Edit modal -->
      <div v-if="selectedUser" class="modal" role="dialog" aria-modal="true">
        <h3 id="editUserTitle">Edit User</h3>
        <form @submit.prevent="updateUser">
          <label for="editVards">Name</label>
          <input id="editVards" v-model.trim="selectedUser.vards" required />

          <label for="editEpasts">Email</label>
          <input id="editEpasts" type="email" v-model.trim="selectedUser.epasts" required />

          <label for="editParole">Password</label>
          <input id="editParole" type="password" v-model.trim="selectedUser.parole" required />

          <label for="editLoma">Role</label>
          <select id="editLoma" v-model.number="selectedUser.idlomas" required>
            <option :value="1">User</option>
            <option :value="2">Administrator</option>
          </select>

          <div class="modal-actions">
            <button type="submit" class="action-button save-button">Save</button>
            <button type="button" class="action-button cancel-button" @click="selectedUser = null">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Statistics table -->
    <section aria-label="Site statistics" class="stats-section">
      <h2>Statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>Spot Count</td>
            <td>{{ stats.spotCount }}</td>
          </tr>
          <tr>
            <td>User Count</td>
            <td>{{ stats.userCount }}</td>
          </tr>
          <tr>
            <td>Review Count</td>
            <td>{{ stats.reviewCount }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      stats: {
        spotCount: 0,
        userCount: 0,
        reviewCount: 0,
      },
      selectedUser: null,
      searchEmail: "",
      sortKey: "",
      sortOrders: {
        epasts: 1,
        vards: 1,
      },
    };
  },
  mounted() {
    this.fetchUsers();
    this.fetchStats();
  },
  computed: {
    filteredAndSortedUsers() {
      let filtered = this.users.filter((user) =>
        user.epasts.toLowerCase().includes(this.searchEmail.toLowerCase().trim()) 
      );

      if (this.sortKey) {
        const order = this.sortOrders[this.sortKey];
        filtered.sort((a, b) => {
          const aVal = (a[this.sortKey] || "").toString().toLowerCase();
          const bVal = (b[this.sortKey] || "").toString().toLowerCase();

          if (aVal < bVal) return -1 * order;
          if (aVal > bVal) return 1 * order;

          return 0;
        });
      }

      return filtered;
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const role = localStorage.getItem("idlomas");

        const response = await axios.get("http://localhost:3000/users", {
          headers: { "X-User-Role": role },
        });
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users.", error);
        alert("Failed to load users.");
      }
    },
    async fetchStats() {
      try {
        const role = localStorage.getItem("idlomas");

        const response = await axios.get("http://localhost:3000/api/stats", {
          headers: { "X-User-Role": role },
        });
        this.stats = response.data;
      } catch (error) {
        console.error("Error fetching statistics.", error);
        alert("Failed to load statistics.");
      }
    },
    toggleSort(key) {
      if (this.sortKey === key) {
        this.sortOrders[key] = -this.sortOrders[key];
      } else {
        this.sortKey = key;
      }
    },
    editUser(user) {
      this.selectedUser = { ...user };
    },
    async updateUser() {
      try {
        const role = localStorage.getItem("idlomas");

        if (
          !this.selectedUser.vards ||
          !this.selectedUser.epasts ||
          !this.selectedUser.parole ||
          !this.selectedUser.idlomas
        ) {
          alert("Please fill in all fields.");
          return;
        }

        await axios.put(
          `http://localhost:3000/users/${this.selectedUser.idlietotajs}`,
          this.selectedUser,
          { headers: { "X-User-Role": role } }
        );
        alert("User updated successfully.");
        this.selectedUser = null;
        this.fetchUsers();
      } catch (error) {
        console.error("Error updating user.", error);
        alert("Failed to update user.");
      }
    },
    async deleteUser(user) {
      if (!confirm(`Are you sure you want to delete user ${user.idlietotajs}?`)) return;

      try {
        const role = localStorage.getItem("idlomas");

        await axios.delete(`http://localhost:3000/users/${user.idlietotajs}`, {
          headers: { "X-User-Role": role },
        });
        alert("User deleted.");
        this.fetchUsers();
      } catch (error) {
        console.error("Error!", error);
        alert("Failed to delete user.");
      }
    },
  },
};

</script>

<style scoped>
.admin-container {
  max-width: 1000px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
  padding: 0 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 20px #00000020;
}

h1,
h2 {
  text-align: center;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='search'], input[type='email'], input[type='password'], select {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

th,
td {
  border: 1px solid #ccc;
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: #e0e0e0;
  cursor: pointer;
  user-select: none;
}

th[role='button']:focus {
  outline: 3px solid #007BFF;
}

tr:hover {
  background-color: #f0f8ff;
}

.action-button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  border: none;
  color: #fff;
  font-size: 0.9rem;
}

.edit-button {
  background: #17a2b8;
}

.delete-button {
  background: #dc3545;
}

.save-button {
  background: #28a745;
}

.cancel-button {
  background: #6c757d;
}

.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 30px #00000050;
  max-width: 400px;
  margin: 5rem auto;
  position: relative;
}

.modal-actions {
  margin-top: 1rem;
  text-align: center;
}

.stats-section {
  max-width: 400px;
  margin: 0 auto 3rem;
}

.stats-section table td {
  padding: 0.75rem;
  border: 1px solid #ccc;
}
</style>
