@extends('layouts.main')

@section('title', 'CO - Signin')

@section('content')
    <div id="auth-card">
        <div class="container">
            <div class="card login-card">
                <div class="row no-gutters">
                    <div class="col-lg-5 d-none d-lg-block">
                        <img src="/img/login.jpg" alt="login" class="login-card-img">
                    </div>
                    <div class="col-lg-7">
                        <div class="card-body">
                            <div class="brand-wrapper">
                                <img src="/img/logo.webp" alt="logo" class="logo">
                                <p class="title">Calendar Organizer</p>
                            </div>
                            <p class="login-card-description">Sign Up into your account</p>

                            <form action="{{ route('auth.register') }}" id="auth-form" method="post" class="row">
                                @csrf

                                <div class="col-12 col-md-6">
                                    <div class="input_group field">
                                        <input type="text" class="input_field validate @error('name') invalid @enderror"
                                            placeholder="Name" value="{{ old('name') }}" name="name" id='name-reg'
                                            required />
                                        <label for="name" class="input_label">Name</label>
                                        <span class="input-error d-none caps-lock">Caps Lock activated</span>
                                        @error('name')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>


                                    <div class="input_group field">
                                        <input type="text" class="input_field validate @error('email') invalid @enderror"
                                            placeholder="Email" value="{{ old('email') }}" name="email" id='email-reg'
                                            required />
                                        <label for="email" class="input_label">Email</label>
                                        <span class="input-error d-none caps-lock">Caps Lock activated</span>
                                        @error('email')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>


                                    <div class="input_group field">
                                        <input type="tel" class="input_field validate @error('phone') invalid @enderror"
                                            placeholder="Phone" value="{{ old('phone') }}" name="phone" id='phone-reg' />
                                        <label for="phone" class="input_label">Phone</label>
                                        <span class="input-error d-none caps-lock">Caps Lock activated</span>
                                        @error('phone')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="input_group field">
                                        <input type="text" class="input_field validate @error('surname1') invalid @enderror"
                                            placeholder="First surname" value="{{ old('surname1') }}" name="surname1"
                                            id='surname1-reg' />
                                        <label for="phone" class="input_label">First surname</label>
                                        <span class="input-error d-none caps-lock">Caps Lock activated</span>
                                        @error('surname1')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="input_group field">
                                        <input type="text" class="input_field validate @error('surname2') invalid @enderror"
                                            placeholder="Second surname" value="{{ old('surname2') }}" name="surname2"
                                            id='surname2-reg' />
                                        <label for="surname2" class="input_label">Second surname</label>
                                        <span class="input-error d-none caps-lock">Caps Lock activated</span>
                                        @error('surname2')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="input_group field">
                                        <input type="text"
                                            class="input_field validate datepicker
                                            @error('birth_date') invalid @enderror"
                                            placeholder="Birth date" value="{{ old('birth_date') }}" name="birth_date"
                                            id='birth_date-reg' />
                                        <label for="birth_date" class="input_label">Birth date</label>
                                        @error('birth_date')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>

                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="input_group radio">
                                        <label for="birth_date">Gender</label>
                                        <div class="d-flex align-items-center gap-1 mt-2">
                                            @foreach (\App\Models\User::GENDERS as $key => $gender)
                                                <input {{ old('gender') == $key ? 'checked' : '' }} type="radio"
                                                    id="{{ $key }}" name="gender" value="{{ $key }}">
                                                <label for="{{ $key }}"
                                                    class="radio-label">{{ $gender }}
                                                </label>
                                            @endforeach
                                        </div>
                                        @error('gender')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>
                                    <div class="input_group">
                                        <label for="nation">Nation</label>
                                        <select id="nation_id" class="mt-2" name="nation_id">
                                            @foreach ($nations as $key => $nation)
                                                <option {{ old('nation_id') == $nation->id ? 'selected' : '' }}
                                                    value="{{ $nation->id }}">
                                                    {{ $nation->code }} - {{ $nation->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <div class="input_group field">
                                        <input type="password" class="input_field validate @error('password') invalid @enderror"
                                            placeholder="Password" value="{{ old('password') }}" name="password"
                                            id='password-reg' />
                                        <label for="password" class="input_label">Password</label>
                                        <span class="input-error d-none caps-lock">Caps Lock activated</span>
                                        @error('password')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>

                                    <div class="input_group field">
                                        <input type="password"
                                            class="input_field validate @error('password_confirmation') invalid @enderror"
                                            placeholder="Password Confirmation" value="{{ old('password_confirmation') }}"
                                            name="password_confirmation" id='password-confirm-reg' />
                                        <label for="password_confirmation" class="input_label">Password Confirmation</label>
                                        <span class="input-error d-none caps-lock">Caps Lock activated</span>
                                        @error('password_confirmation')
                                            <span class="input-error d-block">{{ $message }}</span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="d-flex w-100 justify-content-between">
                                    <div class="d-flex gap-2 align-items-center">
                                        <input type="checkbox" id="terms">
                                        <label for="terms">Accept terms & conditions</label>
                                    </div>
                                    <input id="login" class="btn btn-default mt-4 mb-4 btn-opacity-0" disabled type="submit"
                                        value="Sign Up">
                                </div>
                            </form>
                            <p class="text">Already have an account? <a href="{{ route('auth.login') }}" class="login-link">Login here</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
