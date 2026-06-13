<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AttendanceService
{

    // Egy osztály rögzítése egy adott napra..
    public function recordClassAttendance(SchoolClass $schoolClass, string $date, array $attendanceData): Collection
    {
        return DB::transaction(function () use ($schoolClass, $date, $attendanceData) {

            // Töröljük az aznapi bejegyzéseket ha már léteznek,
            // hogy ne legyen duplikált adat (újrarögzítés esetén).
            Attendance::where('class_id', $schoolClass->id)
                ->where('date', $date)
                ->whereNotNull('student_id')
                ->delete();

            // Minden diákhoz létrehozunk egy jelenléti bejegyzést.
            // Az $attendanceData tömbnek így kell kinéznie:
            // [
            //   ['student_id' => 1, 'status' => 'present', 'note' => ''],
            //   ['student_id' => 2, 'status' => 'absent',  'note' => 'beteg'],
            // ]
            $records = collect($attendanceData)->map(function ($item) use ($schoolClass, $date) {
                return Attendance::create([
                    'student_id' => $item['student_id'],
                    'class_id'   => $schoolClass->id,
                    'date'       => $date,
                    'status'     => $item['status'],
                    'note'       => $item['note'] ?? null,
                ]);
            });

            return $records;
        });
    }

    // Egy diák jelenléti statisztikájának a kiszámítása.. Visszaad majd egy tömböt..
    public function getStudentAttendanceStats(Student $student, ?string $from = null, ?string $to = null): array
    {
        // Dátumra való szűrés
        $query = $student->attendances();

        //ha adtunk meg dátumot, hogy mettől meddig szeretnénk szűrni... ez opcionális.
        if ($from) {
            $query->where('date', '>=', $from);
        }

        if ($to) {
            $query->where('date', '<=', $to);
        }

        // csoportositja a a táblában lévő rekordokat status szerint és megmondja melyik status-ból mennyi van..
        // a groupBy a számítást külön-külön végzi el
        // a pluck() átalakitja a kapott adatokat kulcs-érték párokká.. a count lesz a tömb értéke (value) míg a status lesz a tömb kulcsa (key)
        // átalakítjuk tömbbé a toArray() segitségével a kapott adatokat..
        $stats = $query->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();


        // beállítunk alapértelmezett értékeket mert ha nincs adat akkor legyen 0
        $present = $stats['present'] ?? 0;
        $absent = $stats['absent'] ?? 0;
        $late = $stats['late'] ?? 0;
        $excused = $stats['excused'] ?? 0;
        $total = $present + $absent + $late + $excused;

        // Jelenlét kiszámitása, ha a késés félig jelenlétnek számít..
        // a $total > 0 azért van itt, mert ha új diákról van szó akinek nincs bejegyzése még akkor a végénél a 0-val való osztás hibát okozna.
        $percentage = $total > 0 ? round((($present + $late) / $total) * 100, 2) : 0;

        return [
            'total' => $total,
            'present' => $present,
            'absent' => $absent,
            'late' => $late,
            'excused' => $excused,
            'percentage' => $percentage,
        ];
    }

    // Egy osztály jelenlétének a lekérdezése egy adott napra..
    public function getClassAttendanceByDate(SchoolClass $schoolClass, string $date): Collection
    {
        return Attendance::with(['student'])
            ->where('class_id', $schoolClass->id)
            ->where('date', $date)
            ->whereNotNull('student_id')
            ->orderBy('student_id')
            ->get();
    }
}
