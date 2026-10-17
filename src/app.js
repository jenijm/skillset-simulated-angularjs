import angular from 'angular';
import './styles.css';

angular
  .module('inventoryApp', [])
  .controller('InventoryController', ['$window', function InventoryController($window) {
    const vm = this;
    const storageKey = 'angularjs-inventory-manager';

    vm.categories = ['Electronics', 'Office', 'Home', 'Clothing', 'Food', 'Other'];
    vm.items = loadItems();
    vm.form = emptyForm();
    vm.editingId = null;
    vm.search = '';
    vm.categoryFilter = 'All';

    function emptyForm() {
      return { name: '', category: '', quantity: null, price: null };
    }

    function loadItems() {
      try {
        const stored = JSON.parse($window.localStorage.getItem(storageKey) || '[]');
        return Array.isArray(stored) ? stored : [];
      } catch (error) {
        return [];
      }
    }

    function persistItems() {
      $window.localStorage.setItem(storageKey, JSON.stringify(vm.items));
    }

    function createId() {
      return $window.crypto && $window.crypto.randomUUID
        ? $window.crypto.randomUUID()
        : Date.now() + '-' + Math.random();
    }

    vm.showError = function showError(field) {
      return field && field.$invalid && (field.$touched || field.$$parentForm.$submitted);
    };

    vm.saveItem = function saveItem(form) {
      if (form.$invalid) {
        angular.forEach(form.$error, function touchFields(fields) {
          angular.forEach(fields, function touchField(field) {
            field.$setTouched();
          });
        });
        return;
      }

      const itemData = {
        name: vm.form.name.trim(),
        category: vm.form.category,
        quantity: Number(vm.form.quantity),
        price: Number(Number(vm.form.price).toFixed(2)),
      };

      if (vm.editingId) {
        vm.items = vm.items.map(function updateItem(item) {
          return item.id === vm.editingId
            ? angular.extend({}, item, itemData, { updatedAt: new Date().toISOString() })
            : item;
        });
      } else {
        vm.items.unshift(angular.extend({}, itemData, {
          id: createId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }

      persistItems();
      vm.cancelEdit(form);
    };

    vm.startEdit = function startEdit(item) {
      vm.editingId = item.id;
      vm.form = {
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      };
      $window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    vm.cancelEdit = function cancelEdit(form) {
      vm.editingId = null;
      vm.form = emptyForm();
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

    vm.deleteItem = function deleteItem(item) {
      if (!$window.confirm('Delete “' + item.name + '” from inventory?')) return;
      vm.items = vm.items.filter(function keepItem(current) {
        return current.id !== item.id;
      });
      if (vm.editingId === item.id) vm.cancelEdit();
      persistItems();
    };

    vm.filteredItems = function filteredItems() {
      const term = vm.search.trim().toLowerCase();
      return vm.items.filter(function matches(item) {
        const matchesCategory = vm.categoryFilter === 'All' || item.category === vm.categoryFilter;
        const matchesSearch = !term
          || item.name.toLowerCase().indexOf(term) !== -1
          || item.category.toLowerCase().indexOf(term) !== -1;
        return matchesCategory && matchesSearch;
      });
    };

    vm.totalUnits = function totalUnits() {
      return vm.items.reduce(function sum(total, item) { return total + item.quantity; }, 0);
    };

    vm.totalValue = function totalValue() {
      return vm.items.reduce(function sum(total, item) { return total + (item.quantity * item.price); }, 0);
    };

    vm.lowStockCount = function lowStockCount() {
      return vm.items.filter(function isLow(item) { return item.quantity <= 5; }).length;
    };
  }]);
