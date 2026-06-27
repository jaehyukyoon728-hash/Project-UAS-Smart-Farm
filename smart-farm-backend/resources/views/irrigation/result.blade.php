<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hasil Prediksi Irigasi</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f0f4f8;
            min-height: 100vh;
            padding: 30px 20px;
        }
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            padding: 36px 40px;
            width: 100%;
            max-width: 720px;
            margin: 0 auto;
        }
        h2 { color: #2d6a4f; font-size: 1.5rem; margin-bottom: 24px; }
        h3 { color: #374151; font-size: 1rem; font-weight: 700;
             margin: 28px 0 12px; padding-bottom: 6px;
             border-bottom: 2px solid #e5e7eb; }

        /* ── Section divider ── */
        .section-label {
            display: inline-block;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 3px 10px;
            border-radius: 20px;
            margin-bottom: 10px;
        }
        .label-rf     { background: #dbeafe; color: #1d4ed8; }
        .label-kmeans { background: #fef9c3; color: #92400e; }
        .label-rec    { background: #d1fae5; color: #065f46; }

        /* ── RF Badge ── */
        .rf-badge {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 20px;
            border-radius: 10px;
            margin-bottom: 14px;
        }
        .rf-badge.need-irrigation { background: #fef3c7; border: 2px solid #f59e0b; }
        .rf-badge.no-irrigation   { background: #d1fae5; border: 2px solid #10b981; }
        .rf-badge.kelas2          { background: #ede9fe; border: 2px solid #8b5cf6; }
        .rf-badge .icon  { font-size: 2rem; }
        .rf-badge .label { font-size: 1.2rem; font-weight: 700; color: #1f2937; }
        .rf-badge .conf  { font-size: 0.83rem; color: #6b7280; margin-top: 2px; }

        /* ── K-Means card ── */
        .cluster-card {
            background: #fffbeb;
            border: 1.5px solid #fde68a;
            border-radius: 10px;
            padding: 16px 20px;
        }
        .cluster-title { font-size: 1.05rem; font-weight: 700; color: #1f2937; margin-bottom: 8px; }
        .cluster-desc  { font-size: 0.88rem; color: #4b5563; line-height: 1.55; margin-bottom: 12px; }
        .cluster-stats { display: flex; gap: 12px; flex-wrap: wrap; }
        .stat-pill {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            padding: 4px 14px;
            font-size: 0.8rem;
            color: #374151;
        }

        /* ── Recommendation card ── */
        .rec-card {
            background: #f0fdf4;
            border: 1.5px solid #86efac;
            border-radius: 10px;
            padding: 16px 20px;
        }
        .rec-summary { font-size: 1.05rem; font-weight: 700; color: #1f2937; margin-bottom: 8px; }
        .rec-detail  { font-size: 0.88rem; color: #4b5563; line-height: 1.6; }

        /* ── Tabel ── */
        table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
        th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
        th { background: #f9fafb; font-weight: 600; color: #374151; }
        td { color: #1f2937; }

        /* Progress bar */
        .prob-bar-wrap {
            background: #f3f4f6; border-radius: 6px;
            height: 9px; width: 110px;
            display: inline-block; vertical-align: middle; margin-left: 8px;
        }
        .prob-bar { height: 100%; border-radius: 6px; background: #2d6a4f; }

        .btn-back {
            display: inline-block; margin-top: 28px;
            background: #2d6a4f; color: white; text-decoration: none;
            padding: 11px 24px; border-radius: 8px;
            font-weight: 600; font-size: 0.93rem; transition: background 0.2s;
        }
        .btn-back:hover { background: #1b4332; }
    </style>
</head>
<body>
<div class="card">
    <h2>📊 Hasil Analisis Smart Farming</h2>

    {{-- ═══════════════════════════════════════════
         BAGIAN 1: Random Forest
    ═══════════════════════════════════════════ --}}
    <span class="section-label label-rf">🤖 Random Forest — Prediksi Irigasi</span>

    @php
        $badgeClass = match($rf['prediction_id']) {
            1       => 'need-irrigation',
            0       => 'no-irrigation',
            default => 'kelas2'
        };
        $icon = match($rf['prediction_id']) {
            1       => '💧',
            0       => '✅',
            default => '🔵'
        };
    @endphp

    <div class="rf-badge {{ $badgeClass }}">
        <div class="icon">{{ $icon }}</div>
        <div>
            <div class="label">{{ $rf['prediction_label'] }}</div>
            <div class="conf">Confidence: {{ number_format($rf['confidence'] * 100, 2) }}%</div>
        </div>
    </div>

    <h3>Probabilitas Setiap Kelas</h3>
    <table>
        <tr><th>Kelas</th><th>Probabilitas</th></tr>
        @foreach ($rf['probabilities'] as $class => $prob)
        <tr>
            <td>{{ $class }}</td>
            <td>
                {{ number_format($prob * 100, 2) }}%
                <span class="prob-bar-wrap">
                    <span class="prob-bar" style="width: {{ $prob * 100 }}%"></span>
                </span>
            </td>
        </tr>
        @endforeach
    </table>

    {{-- ═══════════════════════════════════════════
         BAGIAN 2: K-Means Clustering
    ═══════════════════════════════════════════ --}}
    <h3></h3>
    <span class="section-label label-kmeans">🗺️ K-Means — Kondisi Lahan</span>

    <div class="cluster-card">
        <div class="cluster-title">
            {{ $kmeans['cluster_emoji'] }} Cluster {{ $kmeans['cluster_id'] }} —
            {{ $kmeans['cluster_name'] }}
        </div>
        <div class="cluster-desc">{{ $kmeans['description'] }}</div>
        <div class="cluster-stats">
            <span class="stat-pill">💧 Rata-rata MOI: {{ $kmeans['cluster_avg']['moi'] }}</span>
            <span class="stat-pill">🌱 Avg Stage: {{ $kmeans['cluster_avg']['seedling_stage'] }}</span>
            <span class="stat-pill">🌡️ Avg Suhu: {{ $kmeans['cluster_avg']['temp'] }}°C</span>
        </div>
    </div>

    {{-- ═══════════════════════════════════════════
         BAGIAN 3: Rekomendasi Gabungan
    ═══════════════════════════════════════════ --}}
    <h3></h3>
    <span class="section-label label-rec">💡 Rekomendasi Smart Farming</span>

    <div class="rec-card">
        <div class="rec-summary">{{ $rec['summary'] }}</div>
        <div class="rec-detail">{{ $rec['detail'] }}</div>
    </div>

    {{-- ═══════════════════════════════════════════
         BAGIAN 4: Data Input
    ═══════════════════════════════════════════ --}}
    <h3>Data Input</h3>
    <table>
        <tr><th>Fitur</th><th>Nilai</th></tr>
        <tr><td>Jenis Tanaman</td><td>{{ $input['crop_id'] }}</td></tr>
        <tr><td>Jenis Tanah</td><td>{{ $input['soil_type'] }}</td></tr>
        <tr><td>Tahap Pertumbuhan</td><td>{{ $input['seedling_stage'] }}</td></tr>
        <tr><td>MOI</td><td>{{ $input['moi'] }}</td></tr>
        <tr><td>Suhu (°C)</td><td>{{ $input['temp'] }}</td></tr>
        <tr><td>Kelembaban (%)</td><td>{{ $input['humidity'] }}</td></tr>
    </table>

    <a href="{{ route('irrigation.form') }}" class="btn-back">← Prediksi Lagi</a>
</div>
</body>
</html>