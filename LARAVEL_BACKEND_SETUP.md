# ShaQ DIDI - Laravel Backend Integration Guide

This frontend is configured to communicate with a standalone Laravel REST API. Follow these instructions to set up your backend.

---

## 1. Environment Configuration

### Frontend (`.env`)
```env
VITE_API_BASE_URL="http://localhost:8000/api"
VITE_LARAVEL_URL="http://localhost:8000"
VITE_APP_NAME="ShaQ DIDI"
VITE_SANCTUM_CSRF_URL="http://localhost:8000/sanctum/csrf-cookie"
```

### Laravel (`.env`)
```env
APP_NAME="ShaQ DIDI Backend"
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

---

## 2. CORS Configuration (`config/cors.php`)

Ensure `config/cors.php` accepts requests and credentials from `http://localhost:3000`:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## 3. Database Migration Schemas

### 3.1 Users Migration
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('phone_number')->nullable();
    $table->enum('role', ['PS', 'NSP'])->default('PS'); // PS = Permanent Staff, NSP = National Service Personnel
    $table->string('station')->default('Haatso Station');
    $table->rememberToken();
    $table->timestamps();
});
```

### 3.2 Orders Migration
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Permanent Staff customer
    $table->foreignId('nsp_id')->nullable()->constrained('users')->nullOnDelete(); // Assigned NSP runner
    $table->string('food_item_id');
    $table->string('food_item_name');
    $table->string('location')->default('Haatso Station');
    $table->string('image')->nullable();
    $table->decimal('amount', 8, 2); // Custom price set by Permanent Staff
    $table->text('notes')->nullable();
    $table->enum('status', ['Preparing', 'Dispatched', 'Delivered'])->default('Preparing');
    $table->timestamps();
});
```

---

## 4. API Routes (`routes/api.php`)

```php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\FoodJointController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/food-joints', [FoodJointController::class, 'index']);

// Protected routes (Laravel Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Permanent Staff orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // NSP assigned orders
    Route::get('/nsp/orders', [OrderController::class, 'nspAssignedOrders']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});
```

---

## 5. Starting the Backend

```bash
# 1. Run migrations
php artisan migrate

# 2. Serve the Laravel API on port 8000
php artisan serve --port=8000
```
