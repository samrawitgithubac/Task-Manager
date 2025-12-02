<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing users with NULL role to 'user'
        DB::table('users')->whereNull('role')->update(['role' => 'user']);

        // Set a column default at DB level. Use SQL because change() requires doctrine/dbal.
        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `users` MODIFY `role` varchar(255) NOT NULL DEFAULT 'user'");
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE \"users\" ALTER COLUMN \"role\" SET DEFAULT 'user'");
            DB::statement("UPDATE \"users\" SET \"role\" = 'user' WHERE \"role\" IS NULL");
        } else {
            // Fallback: attempt a safe schema modification using Laravel schema builder
            try {
                Schema::table('users', function ($table) {
                    $table->string('role')->default('user')->change();
                });
            } catch (\Throwable $e) {
                // If change() not available, migration already set existing rows above; leave column as-is.
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `users` MODIFY `role` varchar(255) DEFAULT NULL");
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE \"users\" ALTER COLUMN \"role\" DROP DEFAULT");
        } else {
            try {
                Schema::table('users', function ($table) {
                    $table->string('role')->nullable()->default(null)->change();
                });
            } catch (\Throwable $e) {
                // ignore
            }
        }
    }
};
