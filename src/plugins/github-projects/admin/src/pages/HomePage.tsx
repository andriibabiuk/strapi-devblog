import { Box, EmptyStateLayout, Loader, Table, Tbody, Th, Thead, Tr, Typography, Checkbox } from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';
import BulkActions from '../components/BulkActions';
import Repo from '../components/Repo';
import type { RepoData } from '../types';
import axios from '../utils/axiosInstance';

const COL_COUNT = 5;

const HomePage = () => {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const { toggleNotification } = useNotification();

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    axios
      .get<RepoData[]>('/github-projects/repos')
      .then((response) => {
        if (!cancelled) setRepos(response.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Something went wrong while fetching repos.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allSelected = repos.length > 0 && selectedIds.length === repos.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < repos.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : repos.map((repo) => repo.id));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const createProject = async (repo: RepoData) => {
    try {
      const response = await axios.post('/github-projects/project', repo);
      setRepos((prev) =>
        prev.map((item) => (item.id !== repo.id ? item : { ...item, projectId: response.data.documentId }))
      );
      toggleNotification({
        type: 'success',
        title: 'Project created',
        message: `Successfully created project ${response.data.title}`,
      });
    } catch (err: any) {
      toggleNotification({
        type: 'danger',
        title: 'An error occurred',
        message: err.message ?? 'Failed to create project.',
      });
    }
  };

  const deleteProject = async (repo: RepoData) => {
    if (!repo.projectId) return;

    try {
      await axios.delete(`/github-projects/project/${repo.projectId}`);
      setRepos((prev) => prev.map((item) => (item.id !== repo.id ? item : { ...item, projectId: null })));
      toggleNotification({
        type: 'success',
        title: 'Project deleted',
        message: `Successfully deleted the project linked to ${repo.name}`,
      });
    } catch (err: any) {
      toggleNotification({
        type: 'danger',
        title: 'An error occurred',
        message: err.message ?? 'Failed to delete project.',
      });
    }
  };

  const bulkCreateProjects = async (targetRepos: RepoData[]) => {
    const results = await Promise.allSettled(
      targetRepos.map((repo) =>
        axios.post('/github-projects/project', repo).then((response) => ({ repo, documentId: response.data.documentId }))
      )
    );

    const succeeded = results.filter(
      (result): result is PromiseFulfilledResult<{ repo: RepoData; documentId: string }> => result.status === 'fulfilled'
    );
    const failedCount = results.length - succeeded.length;

    if (succeeded.length > 0) {
      setRepos((prev) =>
        prev.map((item) => {
          const match = succeeded.find((result) => result.value.repo.id === item.id);
          return match ? { ...item, projectId: match.value.documentId } : item;
        })
      );
      toggleNotification({
        type: 'success',
        title: 'Projects created',
        message: `Successfully created ${succeeded.length} project(s).`,
      });
    }
    if (failedCount > 0) {
      toggleNotification({
        type: 'danger',
        title: 'An error occurred',
        message: `Failed to create ${failedCount} project(s).`,
      });
    }

    setSelectedIds([]);
  };

  const bulkDeleteProjects = async (targetRepos: RepoData[]) => {
    const results = await Promise.allSettled(
      targetRepos.map((repo) => axios.delete(`/github-projects/project/${repo.projectId}`).then(() => repo))
    );

    const succeeded = results.filter(
      (result): result is PromiseFulfilledResult<RepoData> => result.status === 'fulfilled'
    );
    const failedCount = results.length - succeeded.length;

    if (succeeded.length > 0) {
      const succeededIds = new Set(succeeded.map((result) => result.value.id));
      setRepos((prev) => prev.map((item) => (succeededIds.has(item.id) ? { ...item, projectId: null } : item)));
      toggleNotification({
        type: 'success',
        title: 'Projects deleted',
        message: `Successfully deleted ${succeeded.length} project(s).`,
      });
    }
    if (failedCount > 0) {
      toggleNotification({
        type: 'danger',
        title: 'An error occurred',
        message: `Failed to delete ${failedCount} project(s).`,
      });
    }

    setSelectedIds([]);
  };

  if (loading) {
    return (
      <Box padding={8} background="neutral100">
        <Loader>Loading repos...</Loader>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={8} background="neutral100">
        <EmptyStateLayout content={error} />
      </Box>
    );
  }

  if (repos.length === 0) {
    return (
      <Box padding={8} background="neutral100">
        <EmptyStateLayout content="No public repositories found." />
      </Box>
    );
  }

  return (
    <Box padding={8} background="neutral100">
      <BulkActions
        selectedRepos={repos.filter((repo) => selectedIds.includes(repo.id))}
        onBulkCreate={bulkCreateProjects}
        onBulkDelete={bulkDeleteProjects}
      />
      <Table colCount={COL_COUNT} rowCount={repos.length + 1}>
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                aria-label="Select all entries"
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={toggleSelectAll}
              />
            </Th>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Description</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Url</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {repos.map((repo) => (
            <Repo
              key={repo.id}
              repo={repo}
              selected={selectedIds.includes(repo.id)}
              onSelect={toggleSelect}
              onCreateProject={createProject}
              onDeleteProject={deleteProject}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export { HomePage };
