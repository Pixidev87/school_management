<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IssueLibraryBookRequest;
use App\Http\Requests\StoreLibraryBookRequest;
use App\Http\Resources\LibraryBookResource;
use App\Http\Resources\LibraryIssueResource;
use App\Services\LibraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LibraryController extends Controller
{
    public function __construct(
        private LibraryService $libraryService
    ) {}


    // Az összes könyv listázása.
    public function index(Request $request): AnonymousResourceCollection
    {
        $onlyAvailable = $request->boolean('available');
        $books = $this->libraryService->getAllBooks(15, $onlyAvailable);
        return LibraryBookResource::collection($books);
    }


    // Új könyv hozzáadása.
    public function store(StoreLibraryBookRequest $request): LibraryBookResource
    {
        $book = $this->libraryService->createBook($request->validated());
        return new LibraryBookResource($book);
    }


    // Egy könyv összes adatával és kölcsönzéseivel..
    public function show(int $id): LibraryBookResource
    {
        $book = $this->libraryService->getBookById($id);
        return new LibraryBookResource($book);
    }

    // Egy könyv adatainak frissítése..
    public function update(Request $request, int $id): LibraryBookResource
    {
        $validated = $request->validate([
            'title'            => 'sometimes|required|string|max:255',
            'author'           => 'nullable|string|max:255',
            'isbn'             => 'nullable|string|max:20|unique:library_books,isbn,' . $id,
            'category'         => 'nullable|string|max:100',
            'total_copies'     => 'sometimes|required|integer|min:1',
            'available_copies' => 'sometimes|required|integer|min:0',
        ]);

        $book = $this->libraryService->getBookById($id);
        $book = $this->libraryService->updateBook($book, $validated);
        return new LibraryBookResource($book);
    }

    // Könyv törlése (soft delete)..
    public function destroy(int $id): JsonResponse
    {
        $book = $this->libraryService->getBookById($id);
        $this->libraryService->deleteBook($book);

        return response()->json([
            'message' => 'Könyv sikeresen törölve.'
        ]);
    }

    // Könyv kölcsönzése..
    public function issue(IssueLibraryBookRequest $request, int $id): LibraryIssueResource
    {
        $book  = $this->libraryService->getBookById($id);
        $issue = $this->libraryService->issueBook($book, $request->validated());

        return new LibraryIssueResource($issue);
    }

    // Könyv visszahozásának rögzítése..
    public function returnBook(int $issueId): LibraryIssueResource
    {
        $issue = $this->libraryService->getIssuesById($issueId);
        $issue = $this->libraryService->returnBook($issue);

        return new LibraryIssueResource($issue);
    }

    // Aktív (ki nem hozott) kölcsönzések..
    public function activeIssues(): AnonymousResourceCollection
    {
        $issues = $this->libraryService->getActiveIssues();
        return LibraryIssueResource::collection($issues);
    }

    // Lejárt, vissza nem hozott kölcsönzések..
    public function overdueIssues(): AnonymousResourceCollection
    {
        $issues = $this->libraryService->getOverdueIssues();
        return LibraryIssueResource::collection($issues);
    }
}
