<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prediksi Kebutuhan Irigasi</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f0f4f8;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            padding: 36px 40px;
            width: 100%;
            max-width: 600px;
        }
        h2 {
            color: #2d6a4f;
            font-size: 1.6rem;
            margin-bottom: 6px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 28px;
        }
        .form-group {
            margin-bottom: 18px;
        }
        label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 6px;
            font-size: 0.92rem;
        }
        .hint {
            font-size: 0.78rem;
            color: #9ca3af;
            font-weight: normal;
            margin-left: 4px;
        }
        select, input[type="number"] {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.95rem;
            color: #1f2937;
            background: #fafafa;
            transition: border-color 0.2s;
            appearance: none;
        }
        select {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 40px;
        }
        select:focus, input[type="number"]:focus {
            outline: none;
            border-color: #2d6a4f;
            background: white;
        }
        .row-2 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
        }
        .error-box {
            background: #fef2f2;
            border: 1px solid #fca5a5;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 20px;
            color: #dc2626;
            font-size: 0.88rem;
        }
        .error-box ul { padding-left: 16px; }
        button[type="submit"] {
            width: 100%;
            background: #2d6a4f;
            color: white;
            border: none;
            padding: 13px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 8px;
            transition: background 0.2s;
        }
        button[type="submit"]:hover { background: #1b4332; }
        .example-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 14px 18px;
            margin-top: 24px;
            font-size: 0.85rem;
            color: #166534;
        }
        .example-box h4 { margin-bottom: 8px; font-size: 0.9rem; }
        .example-box p { margin-bottom: 4px; }
    </style>
</head>
<body>
<div class="card">
    <h2>🌾 Prediksi Kebutuhan Irigasi</h2>
    <p class="subtitle">Masukkan data kondisi tanaman untuk memprediksi kebutuhan irigasi.</p>

    @if ($errors->any())
    <div class="error-box">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
    @endif

    <form method="POST" action="{{ route('irrigation.predict') }}">
        @csrf

        {{-- Baris 1: Jenis Tanaman --}}
        <div class="form-group">
            <label for="crop_id">Jenis Tanaman <span class="hint">(Crop ID)</span></label>
            <select name="crop_id" id="crop_id" required>
                <option value="">-- Pilih Tanaman --</option>
                @foreach ($cropOptions as $crop)
                    <option value="{{ $crop }}" {{ old('crop_id') === $crop ? 'selected' : '' }}>
                        {{ $crop }}
                    </option>
                @endforeach
            </select>
        </div>

        {{-- Baris 2: Jenis Tanah --}}
        <div class="form-group">
            <label for="soil_type">Jenis Tanah <span class="hint">(Soil Type)</span></label>
            <select name="soil_type" id="soil_type" required>
                <option value="">-- Pilih Jenis Tanah --</option>
                @foreach ($soilOptions as $soil)
                    <option value="{{ $soil }}" {{ old('soil_type') === $soil ? 'selected' : '' }}>
                        {{ $soil }}
                    </option>
                @endforeach
            </select>
        </div>

        {{-- Baris 3: Tahap Pertumbuhan --}}
        <div class="form-group">
            <label for="seedling_stage">Tahap Pertumbuhan <span class="hint">(Seedling Stage)</span></label>
            <select name="seedling_stage" id="seedling_stage" required>
                <option value="">-- Pilih Tahap --</option>
                @foreach ($seedlingOptions as $stage)
                    <option value="{{ $stage }}" {{ old('seedling_stage') === $stage ? 'selected' : '' }}>
                        {{ $stage }}
                    </option>
                @endforeach
            </select>
        </div>

        {{-- Baris 4: Numerik --}}
        <div class="row-2">
            <div class="form-group">
                <label for="moi">MOI <span class="hint">(1–100)</span></label>
                <input type="number" name="moi" id="moi"
                    step="0.1" min="1" max="100"
                    value="{{ old('moi', 50) }}" required>
            </div>
            <div class="form-group">
                <label for="temp">Suhu <span class="hint">(°C, 13–46)</span></label>
                <input type="number" name="temp" id="temp"
                    step="0.1" min="13" max="46"
                    value="{{ old('temp', 28) }}" required>
            </div>
            <div class="form-group">
                <label for="humidity">Kelembaban <span class="hint">(%, 15–91)</span></label>
                <input type="number" name="humidity" id="humidity"
                    step="0.1" min="15" max="91"
                    value="{{ old('humidity', 60) }}" required>
            </div>
        </div>

        <button type="submit">🔍 Prediksi Sekarang</button>
    </form>

    <div class="example-box">
        <h4>💡 Contoh Input</h4>
        <p><strong>Perlu Irigasi:</strong> Wheat, Clay Soil, Flowering, MOI=45, Temp=35, Humidity=30</p>
        <p><strong>Tidak Perlu Irigasi:</strong> Tomato, Loam Soil, Seedling Stage, MOI=80, Temp=22, Humidity=75</p>
    </div>
</div>
</body>
</html>