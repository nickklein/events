<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('hash', 10)->unique();
            $table->string('admin_hash', 10)->unique();
            $table->enum('status', ['active', 'closed'])->default('active');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('hash');
            $table->index('admin_hash');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
